import { NextResponse } from 'next/server';
import { queryPostgres } from '@/lib/postgresql';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const limit = parseInt(searchParams.get('limit') || '100');

    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - days);

    // Obtener información detallada de leads recientes
    const leadsQuery = `
      SELECT 
        id,
        "workflowId",
        "startedAt",
        "stoppedAt",
        status,
        EXTRACT(EPOCH FROM ("stoppedAt" - "startedAt")) as duracion
      FROM execution_entity
      WHERE "startedAt" >= $1
      AND finished = true
      ORDER BY "startedAt" DESC
      LIMIT $2
    `;

    const leads = await queryPostgres(leadsQuery, [fechaLimite.toISOString(), limit]);

    return NextResponse.json({
      total: leads.length,
      leads: leads.map(lead => ({
        id: lead.id,
        workflowId: lead.workflowId,
        fecha: lead.startedAt,
        fechaFin: lead.stoppedAt,
        estado: lead.status,
        duracion: Math.round(parseFloat(lead.duracion || '0'))
      }))
    });

  } catch (error) {
    console.error('Error al obtener leads:', error);
    return NextResponse.json(
      { error: 'Error al obtener información de leads' },
      { status: 500 }
    );
  }
}

