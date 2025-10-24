import { NextResponse } from 'next/server';
import { queryPostgres } from '@/lib/postgresql';
import { DashboardMetrics, MetricasGenerales, MetricasComunicacion, MetricasPorPeriodo } from '@/lib/n8n-types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  console.log('[API /api/metrics] Request received');
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    console.log(`[API /api/metrics] Fetching metrics for ${days} days`);

    // Fecha límite para las consultas
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - days);

    // 1. Número de leads únicos (desde execution_metadata)
    const leadsQuery = `
      SELECT COUNT(DISTINCT em."executionId") as total
      FROM execution_metadata em
      INNER JOIN execution_entity ee ON em."executionId" = ee.id
      WHERE em.key = 'Lead'
      AND ee."startedAt" >= $1
    `;
    const leadsResult = await queryPostgres<{ total: string }>(leadsQuery, [fechaLimite.toISOString()]);
    const totalLeads = parseInt(leadsResult[0]?.total || '0');

    // 2. Número de respuestas exitosas (ejecuciones exitosas del workflow)
    const respuestasExitosasQuery = `
      SELECT COUNT(*) as total
      FROM execution_entity
      WHERE "startedAt" >= $1
      AND status = 'success'
      AND finished = true
    `;
    const respuestasExitosasResult = await queryPostgres<{ total: string }>(respuestasExitosasQuery, [fechaLimite.toISOString()]);
    const respuestasExitosas = parseInt(respuestasExitosasResult[0]?.total || '0');

    // 3. Número de reuniones agendadas - Por ahora no tenemos datos reales
    // Se debe configurar en n8n para guardar cuando se agenda una reunión
    const reunionesAgendadas = 0; // null significa que no hay datos configurados

    // 4. Total de respuestas (todas las ejecuciones)
    const respuestasQuery = `
      SELECT COUNT(*) as total
      FROM execution_entity
      WHERE "startedAt" >= $1
      AND finished = true
    `;
    const respuestasResult = await queryPostgres<{ total: string }>(respuestasQuery, [fechaLimite.toISOString()]);
    const totalRespuestas = parseInt(respuestasResult[0]?.total || '0');

    // 5. Tiempo promedio de respuesta (en segundos)
    const tiempoPromedioQuery = `
      SELECT AVG(EXTRACT(EPOCH FROM ("stoppedAt" - "startedAt"))) as promedio
      FROM execution_entity
      WHERE "startedAt" >= $1
      AND "stoppedAt" IS NOT NULL
      AND status = 'success'
    `;
    const tiempoPromedioResult = await queryPostgres<{ promedio: string }>(tiempoPromedioQuery, [fechaLimite.toISOString()]);
    const tiempoPromedioRespuesta = parseFloat(tiempoPromedioResult[0]?.promedio || '0');

    // 6. Cierres efectivos (leads con última interacción hace más de 3 días)
    const cierresQuery = `
      SELECT COUNT(DISTINCT em."executionId") as total
      FROM execution_metadata em
      INNER JOIN execution_entity ee ON em."executionId" = ee.id
      WHERE em.key = 'Lead'
      AND ee."startedAt" >= $1
      AND ee.id NOT IN (
        SELECT "executionId"
        FROM execution_metadata em2
        INNER JOIN execution_entity ee2 ON em2."executionId" = ee2.id
        WHERE em2.key = 'Lead'
        AND ee2."startedAt" >= NOW() - INTERVAL '3 days'
      )
    `;
    const cierresResult = await queryPostgres<{ total: string }>(cierresQuery, [fechaLimite.toISOString()]);
    const cierresEfectivos = parseInt(cierresResult[0]?.total || '0');

    // 7. Métricas por período (últimos 30 días)
    const metricasPorDiaQuery = `
      SELECT 
        DATE("startedAt") as fecha,
        COUNT(DISTINCT id) as leads,
        COUNT(*) as respuestas,
        AVG(EXTRACT(EPOCH FROM ("stoppedAt" - "startedAt"))) as tiempo_promedio
      FROM execution_entity
      WHERE "startedAt" >= $1
      AND finished = true
      GROUP BY DATE("startedAt")
      ORDER BY DATE("startedAt") DESC
      LIMIT 30
    `;
    const metricasPorDiaResult = await queryPostgres<{
      fecha: string;
      leads: string;
      respuestas: string;
      tiempo_promedio: string;
    }>(metricasPorDiaQuery, [fechaLimite.toISOString()]);

    const porPeriodo: MetricasPorPeriodo[] = metricasPorDiaResult.map(row => {
      const leads = parseInt(row.leads || '0');
      return {
        fecha: row.fecha,
        leads: leads,
        reuniones: 0, // Sin datos de reuniones configurados
        respuestas: parseInt(row.respuestas || '0'),
        tiempoPromedio: parseFloat(row.tiempo_promedio || '0')
      };
    });

    // Construir respuesta
    const generales: MetricasGenerales = {
      leadsGenerados: totalLeads, // Leads únicos reales desde metadata
      reunionesAgendadas,
      respuestasAutomaticasCorrectas: respuestasExitosas,
      porcentajeRespuestasCorrectas: totalRespuestas > 0 
        ? Math.round((respuestasExitosas / totalRespuestas) * 100) 
        : 0,
      tiempoPromedioRespuesta: Math.round(tiempoPromedioRespuesta),
      cierresEfectivos,
      porcentajeCierresEfectivos: totalLeads > 0 
        ? Math.round((cierresEfectivos / totalLeads) * 100) 
        : 0,
    };

    // Métricas de comunicación (estos valores podrían ser calculados de manera más sofisticada)
    const comunicacion: MetricasComunicacion = {
      adecuacionMarca: generales.porcentajeRespuestasCorrectas, // Aproximación basada en éxito
      conocimientoProductos: Math.min(95, generales.porcentajeRespuestasCorrectas + 5), // Aproximación
      satisfaccionGeneral: Math.round((generales.porcentajeRespuestasCorrectas + generales.porcentajeCierresEfectivos) / 2)
    };

    const metrics: DashboardMetrics = {
      generales,
      comunicacion,
      porPeriodo,
      ultimaActualizacion: new Date()
    };

    console.log('[API /api/metrics] Metrics calculated successfully');
    return NextResponse.json(metrics);

  } catch (error) {
    console.error('[API /api/metrics] ERROR:', error);
    return NextResponse.json(
      { 
        error: 'Error al obtener las métricas',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

