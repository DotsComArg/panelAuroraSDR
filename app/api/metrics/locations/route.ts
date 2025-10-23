import { NextResponse } from 'next/server';
import { queryPostgres } from '@/lib/postgresql';

export const dynamic = 'force-dynamic';

// Mapeo de códigos de país a nombres
const countryMap: Record<string, string> = {
  '54': 'Argentina',
  '52': 'México',
  '34': 'España',
  '1': 'USA/Canadá',
  '57': 'Colombia',
  '56': 'Chile',
  '51': 'Perú',
  '55': 'Brasil',
  '58': 'Venezuela',
  '593': 'Ecuador',
  '506': 'Costa Rica',
  '507': 'Panamá',
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - days);

    // Obtener números de teléfono desde la tabla kommo_captured_phones
    const phoneQuery = `
      SELECT 
        phone_clean,
        created_at
      FROM kommo_captured_phones
      WHERE created_at >= $1
      AND phone_clean IS NOT NULL
      AND phone_clean != ''
      ORDER BY created_at DESC
    `;
    
    const phoneResults = await queryPostgres<{ 
      phone_clean: string;
      created_at: string;
    }>(phoneQuery, [fechaLimite.toISOString()]);

    // Analizar los teléfonos y agrupar por país
    const locationCounts: Record<string, number> = {};
    
    phoneResults.forEach(row => {
      const phone = row.phone_clean;
      let country = 'Desconocido';
      
      if (phone && phone.startsWith('+')) {
        // Buscar códigos de país de 3 dígitos primero (ej: +593)
        const code3 = phone.substring(1, 4);
        if (countryMap[code3]) {
          country = countryMap[code3];
        } else {
          // Buscar códigos de 2 dígitos (ej: +54, +52)
          const code2 = phone.substring(1, 3);
          if (countryMap[code2]) {
            country = countryMap[code2];
          } else {
            // Buscar código de 1 dígito (ej: +1)
            const code1 = phone.substring(1, 2);
            if (countryMap[code1]) {
              country = countryMap[code1];
            }
          }
        }
      }
      
      locationCounts[country] = (locationCounts[country] || 0) + 1;
    });

    // Convertir a array y ordenar por cantidad
    const locations = Object.entries(locationCounts)
      .map(([pais, cantidad]) => ({
        pais,
        leads: cantidad,
        porcentaje: phoneResults.length > 0 
          ? Math.round((cantidad / phoneResults.length) * 100) 
          : 0
      }))
      .sort((a, b) => b.leads - a.leads);

    return NextResponse.json({
      total: phoneResults.length,
      locations,
      dataSource: 'kommo_captured_phones'
    });

  } catch (error) {
    console.error('Error al obtener ubicaciones:', error);
    return NextResponse.json(
      { error: 'Error al obtener información de ubicaciones' },
      { status: 500 }
    );
  }
}

