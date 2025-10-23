import { NextResponse } from 'next/server';
import { queryPostgres } from '@/lib/postgresql';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query: string;
    let params: any[];

    if (sessionId) {
      // Obtener conversación específica
      query = `
        SELECT 
          id,
          session_id,
          message,
          type,
          created_at
        FROM n8n_chat_histories
        WHERE session_id = $1
        ORDER BY created_at DESC
        LIMIT $2
      `;
      params = [sessionId, limit];
    } else {
      // Obtener resumen de conversaciones recientes
      query = `
        SELECT 
          session_id,
          COUNT(*) as total_mensajes,
          MAX(created_at) as ultima_interaccion,
          COUNT(CASE WHEN type = 'human' THEN 1 END) as mensajes_usuario,
          COUNT(CASE WHEN type = 'ai' THEN 1 END) as mensajes_bot
        FROM n8n_chat_histories
        WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY session_id
        ORDER BY ultima_interaccion DESC
        LIMIT $1
      `;
      params = [limit];
    }

    const conversaciones = await queryPostgres(query, params);

    return NextResponse.json({
      total: conversaciones.length,
      conversaciones
    });

  } catch (error) {
    console.error('Error al obtener conversaciones:', error);
    return NextResponse.json(
      { error: 'Error al obtener información de conversaciones' },
      { status: 500 }
    );
  }
}

