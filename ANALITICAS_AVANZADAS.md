# 📊 Analíticas Avanzadas - Implementación Futura

## 🎯 Objetivo

Este documento describe cómo implementar análisis avanzado de palabras clave y tipos de consulta en el dashboard de Aurora SDR.

## 📋 Estado Actual

### ✅ Métricas Implementadas
- ✅ Tiempo promedio de respuesta
- ✅ Tasa de éxito (respuestas exitosas)
- ✅ Efectividad de cierre
- ✅ Total de leads generados
- ✅ Actividad semanal (gráficos de leads y respuestas)
- ✅ Evolución del tiempo de respuesta

### ⏳ Pendiente de Implementar
- ⏳ Análisis de palabras clave mencionadas
- ⏳ Categorización de tipos de consulta
- ⏳ Análisis de sentimiento
- ⏳ Temas más frecuentes

## 🔧 Implementación Requerida

### 1. Almacenamiento de Historiales de Chat

Para poder analizar las conversaciones, necesitas guardar los mensajes en una tabla dedicada.

#### Opción A: Crear tabla de mensajes en PostgreSQL

```sql
CREATE TABLE IF NOT EXISTS chat_messages (
    id BIGSERIAL PRIMARY KEY,
    execution_id TEXT NOT NULL,
    lead_id TEXT,
    contact_id TEXT,
    message_type TEXT NOT NULL, -- 'user' | 'bot'
    message_content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Índices para búsquedas rápidas
    INDEX idx_execution_id (execution_id),
    INDEX idx_lead_id (lead_id),
    INDEX idx_created_at (created_at)
);
```

#### Modificar el workflow n8n para guardar mensajes:

1. **Agregar nodo PostgreSQL** después de recibir cada mensaje del usuario
2. **Insertar el mensaje del usuario:**
```sql
INSERT INTO chat_messages (execution_id, lead_id, contact_id, message_type, message_content)
VALUES ($1, $2, $3, 'user', $4)
```

3. **Insertar la respuesta del bot:**
```sql
INSERT INTO chat_messages (execution_id, lead_id, contact_id, message_type, message_content)
VALUES ($1, $2, $3, 'bot', $4)
```

### 2. API para Análisis de Palabras Clave

Una vez que tengas los mensajes guardados, crea un endpoint `/api/analytics/keywords`:

```typescript
// app/api/analytics/keywords/route.ts
import { NextResponse } from 'next/server';
import { queryPostgres } from '@/lib/postgresql';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - days);

    // Obtener todas las palabras de mensajes de usuarios
    const query = `
      SELECT 
        LOWER(REGEXP_SPLIT_TO_TABLE(message_content, '\\s+')) as palabra,
        COUNT(*) as menciones
      FROM chat_messages
      WHERE message_type = 'user'
      AND created_at >= $1
      AND LENGTH(REGEXP_SPLIT_TO_TABLE(message_content, '\\s+')) > 3
      GROUP BY palabra
      ORDER BY menciones DESC
      LIMIT 50
    `;

    const keywords = await queryPostgres(query, [fechaLimite.toISOString()]);

    return NextResponse.json({
      keywords: keywords.map(k => ({
        keyword: k.palabra,
        mentions: parseInt(k.menciones)
      })),
      periodo: `${days} días`
    });

  } catch (error) {
    console.error('Error al obtener palabras clave:', error);
    return NextResponse.json(
      { error: 'Error al obtener palabras clave' },
      { status: 500 }
    );
  }
}
```

### 3. Categorización de Tipos de Consulta

Puedes categorizar las consultas usando palabras clave:

```typescript
// app/api/analytics/query-types/route.ts
import { NextResponse } from 'next/server';
import { queryPostgres } from '@/lib/postgresql';

interface QueryCategory {
  type: string;
  keywords: string[];
}

const QUERY_CATEGORIES: QueryCategory[] = [
  {
    type: "Información de Producto",
    keywords: ["precio", "costo", "cuánto", "información", "detalles", "características"]
  },
  {
    type: "Agendar Cita",
    keywords: ["cita", "agendar", "reservar", "turno", "horario", "fecha"]
  },
  {
    type: "Ubicación",
    keywords: ["dónde", "dirección", "ubicación", "lugar", "como llegar"]
  },
  {
    type: "Soporte",
    keywords: ["ayuda", "problema", "error", "no funciona", "soporte"]
  },
  {
    type: "Cancelación",
    keywords: ["cancelar", "eliminar", "borrar", "quitar"]
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - days);

    const queryTypes = await Promise.all(
      QUERY_CATEGORIES.map(async (category) => {
        const keywordPattern = category.keywords.join('|');
        
        const query = `
          SELECT COUNT(*) as count
          FROM chat_messages
          WHERE message_type = 'user'
          AND created_at >= $1
          AND LOWER(message_content) ~* $2
        `;
        
        const result = await queryPostgres<{ count: string }>(
          query, 
          [fechaLimite.toISOString(), keywordPattern]
        );
        
        return {
          type: category.type,
          count: parseInt(result[0]?.count || '0')
        };
      })
    );

    const total = queryTypes.reduce((sum, qt) => sum + qt.count, 0);

    return NextResponse.json({
      queryTypes: queryTypes.map(qt => ({
        ...qt,
        percentage: total > 0 ? Math.round((qt.count / total) * 100) : 0
      })),
      total
    });

  } catch (error) {
    console.error('Error al obtener tipos de consulta:', error);
    return NextResponse.json(
      { error: 'Error al obtener tipos de consulta' },
      { status: 500 }
    );
  }
}
```

### 4. Análisis de Sentimiento (Opcional - Requiere IA)

Para análisis de sentimiento más sofisticado, puedes usar OpenAI:

```typescript
// app/api/analytics/sentiment/route.ts
import { NextResponse } from 'next/server';
import { queryPostgres } from '@/lib/postgresql';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7'); // Menos días por costo

    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - days);

    // Obtener mensajes de usuarios
    const messages = await queryPostgres<{ message_content: string }>(`
      SELECT message_content
      FROM chat_messages
      WHERE message_type = 'user'
      AND created_at >= $1
      LIMIT 100
    `, [fechaLimite.toISOString()]);

    let positivo = 0, neutral = 0, negativo = 0;

    // Analizar sentimiento con OpenAI (en batch para eficiencia)
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: "Analiza el sentimiento de cada mensaje (positivo/neutral/negativo). Responde solo con la palabra correspondiente."
      }, {
        role: "user",
        content: messages.map(m => m.message_content).join('\n---\n')
      }]
    });

    const sentiments = response.choices[0].message.content?.split('\n') || [];
    
    sentiments.forEach(s => {
      if (s.includes('positivo')) positivo++;
      else if (s.includes('negativo')) negativo++;
      else neutral++;
    });

    const total = positivo + neutral + negativo;

    return NextResponse.json({
      sentiment: {
        positivo: Math.round((positivo / total) * 100),
        neutral: Math.round((neutral / total) * 100),
        negativo: Math.round((negativo / total) * 100)
      },
      total
    });

  } catch (error) {
    console.error('Error al analizar sentimiento:', error);
    return NextResponse.json(
      { error: 'Error al analizar sentimiento' },
      { status: 500 }
    );
  }
}
```

## 🚀 Próximos Pasos

1. **Implementar tabla `chat_messages`** en PostgreSQL
2. **Modificar workflow n8n** para guardar mensajes
3. **Crear APIs** de análisis (`/api/analytics/keywords`, `/api/analytics/query-types`)
4. **Actualizar componente** `/app/(dashboard)/analiticas/page.tsx` para consumir las nuevas APIs
5. **Opcional:** Implementar análisis de sentimiento con OpenAI

## 📝 Notas

- El análisis de palabras clave puede generar ruido. Considera crear una lista de "stop words" (palabras comunes a ignorar).
- El análisis de sentimiento con IA tiene costo. Úsalo con moderación o implementa una solución más simple basada en palabras clave.
- Considera agregar caché para reducir consultas a la base de datos en métricas que no cambian frecuentemente.

## 🔗 Referencias

- [PostgreSQL Text Search](https://www.postgresql.org/docs/current/textsearch.html)
- [OpenAI API - Sentiment Analysis](https://platform.openai.com/docs/guides/text-generation)
- [n8n Workflows - PostgreSQL Integration](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.postgres/)

