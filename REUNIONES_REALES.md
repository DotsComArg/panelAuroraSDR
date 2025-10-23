# 📅 Cómo Registrar Reuniones Agendadas Reales

Actualmente, la métrica de "Reuniones Agendadas" muestra **"¡Aún no tenemos datos!"** porque no está configurado el registro en n8n.

## 📋 Problema Actual

- No hay forma de saber cuándo se agenda una reunión
- La metadata no contiene información de agendamiento
- Por eso mostramos un placeholder

## ✅ Solución: Registrar Agendamientos en n8n

Para tener el conteo real de reuniones agendadas, necesitas modificar tu workflow de n8n:

### Opción 1: Cuando el IA agenda una reunión

Si tu agente IA está programado para agendar reuniones (por ejemplo, usando una herramienta de calendario o detectando intención de agendamiento):

1. **En el nodo donde se confirma el agendamiento**, agrega un nodo "Execution Data"

2. **Guarda la metadata:**
```
Key: meeting_scheduled
Value: true
```

3. **Opcionalmente, guarda más detalles:**
```javascript
// En un nodo Code
$execution.customData.set('meeting_scheduled', 'true');
$execution.customData.set('meeting_date', '2025-11-15');
$execution.customData.set('meeting_time', '14:00');
```

### Opción 2: Cuando el usuario confirma una reunión

Si las reuniones se agendan manualmente o a través de otro proceso:

1. **Detecta palabras clave** en las respuestas del usuario:
   - "agendemos"
   - "reservar cita"
   - "agendar reunión"
   - "cuándo podemos hablar"

2. **Cuando se detecte, guarda en metadata:**

```javascript
// En un nodo "Function" o "Code"
const userMessage = $json.message.toLowerCase();

const meetingKeywords = [
  'agenda', 'reunión', 'reunion', 'cita', 'llamada',
  'videollamada', 'zoom', 'meet', 'calendly'
];

const hasMeetingIntent = meetingKeywords.some(word => userMessage.includes(word));

if (hasMeetingIntent) {
  $execution.customData.set('meeting_scheduled', 'true');
}

return $input.all();
```

### Opción 3: Integración con Calendario (Google Calendar, Calendly, etc.)

Si usas una herramienta de calendario:

1. **Después del nodo de creación de evento en calendario:**

```javascript
// Si la creación del evento fue exitosa
if ($json.status === 'confirmed' || $json.eventId) {
  $execution.customData.set('meeting_scheduled', 'true');
  $execution.customData.set('calendar_event_id', $json.eventId);
  $execution.customData.set('meeting_date', $json.start.dateTime);
}
```

### Opción 4: Basado en cambio de etapa en CRM

Si cambias la etapa del lead en AmoCRM/Kommo cuando se agenda:

1. **Después de actualizar el lead:**

```javascript
// Detectar si cambió a etapa "Reunión Agendada"
const newStageId = $json.status_id; // O pipeline_stage_id según tu CRM

// ID de la etapa "Reunión Agendada" en tu CRM
const MEETING_STAGE_ID = 86115943; // Reemplaza con tu ID real

if (newStageId === MEETING_STAGE_ID) {
  $execution.customData.set('meeting_scheduled', 'true');
}
```

## 🔧 Código de Referencia para n8n

### Ejemplo Completo: Detección Automática

```javascript
// Nodo "Function" después de la respuesta del IA

const items = $input.all();
const lastMessage = items[items.length - 1].json;

// Variables para detectar agendamiento
let meetingScheduled = false;
let meetingDate = null;

// 1. Revisar si el IA mencionó agendar en su respuesta
if (lastMessage.output) {
  const aiResponse = lastMessage.output.toLowerCase();
  const schedulingPhrases = [
    'agendé', 'agendado', 'reservé', 'confirmé',
    'te espero', 'nos vemos', 'tenés cita'
  ];
  
  meetingScheduled = schedulingPhrases.some(phrase => aiResponse.includes(phrase));
}

// 2. O revisar si se llamó a una herramienta de calendario
if (lastMessage.tools_used && lastMessage.tools_used.includes('calendar_tool')) {
  meetingScheduled = true;
}

// 3. Guardar en metadata si se agendó
if (meetingScheduled) {
  $execution.customData.set('meeting_scheduled', 'true');
  
  // Si tienes la fecha, guárdala también
  if (meetingDate) {
    $execution.customData.set('meeting_date', meetingDate);
  }
  
  console.log('✅ Reunión agendada registrada en metadata');
}

return items;
```

## 📊 Estructura Recomendada en Metadata

Para máxima utilidad, guarda estos campos cuando se agenda una reunión:

```javascript
{
  meeting_scheduled: 'true',
  meeting_date: '2025-11-15',
  meeting_time: '14:00',
  meeting_type: 'videollamada', // o 'presencial', 'telefónica'
  meeting_platform: 'zoom', // o 'google_meet', 'teams'
  meeting_confirmed: 'true' // o 'pending'
}
```

## 🔍 Verificar que Funciona

1. **Ejecuta tu workflow** con un escenario de agendamiento
2. **Revisa la tabla `execution_metadata`** en PostgreSQL:

```sql
SELECT * 
FROM execution_metadata 
WHERE key = 'meeting_scheduled' 
ORDER BY id DESC 
LIMIT 10;
```

3. **Deberías ver registros** con `value = 'true'`
4. **El dashboard se actualizará automáticamente** y mostrará el conteo real

## 📈 Una Vez Configurado

Después de implementar el registro:

1. ✅ El dashboard contará reuniones reales
2. ✅ Mostrará el % de conversión (reuniones / leads)
3. ✅ Actualizará en tiempo real cada 5 minutos
4. ✅ Incluirá filtros por período (últimos 7, 30 días, etc.)

## 🎯 IDs de Etapas en tu CRM

Si usas el método de cambio de etapa, necesitas conocer los IDs:

```sql
-- Consulta para ver tus etapas actuales
SELECT DISTINCT 
  "workflowId",
  name
FROM workflow_entity 
WHERE active = true;
```

Luego revisa en tu CRM (AmoCRM) cuál es el ID de la etapa "Reunión Agendada" o "SOLICITUD_CITA".

---

**Nota:** Mientras no esté configurado, el dashboard mostrará "¡Aún no tenemos datos!" para esta métrica.

