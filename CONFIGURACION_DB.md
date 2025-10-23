# Configuración de la Base de Datos PostgreSQL (n8n)

Este documento explica cómo configurar la conexión a la base de datos PostgreSQL de n8n para visualizar las métricas del dashboard.

## Variables de Entorno

Necesitas configurar las siguientes variables de entorno en tu archivo `.env.local`:

```env
# PostgreSQL Database Connection (n8n)
DATABASE_PUBLIC_URL=postgresql://postgres:zUrQI9Q1_QAT~KA8YMiZ5tl~_HYSm~Kn@yamabiko.proxy.rlwy.net:41643/railway
```

### Pasos para Configurar

1. **Crear el archivo `.env.local`** en la raíz del proyecto si no existe:
   ```bash
   touch .env.local
   ```

2. **Agregar la variable de entorno**:
   ```bash
   echo 'DATABASE_PUBLIC_URL=postgresql://postgres:zUrQI9Q1_QAT~KA8YMiZ5tl~_HYSm~Kn@yamabiko.proxy.rlwy.net:41643/railway' >> .env.local
   ```

3. **Reiniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

## Métricas Disponibles

El dashboard ahora muestra las siguientes métricas extraídas de la base de datos de n8n:

### 📊 Métricas Principales

1. **Nº de leads generados** - Total de ejecuciones exitosas del workflow
2. **Nº de reuniones agendadas** - Leads que llegaron a etapa de agendamiento
3. **% de respuestas automáticas correctas** - Porcentaje de respuestas exitosas
4. **Tiempo promedio de respuesta** - Tiempo promedio de ejecución en segundos
5. **% de cierres efectivos** - Porcentaje de leads cerrados sin intervención manual

### 🎯 Métricas de Calidad

6. **Adecuación de la comunicación de marca** - Evaluación del tono y estilo
7. **Conocimiento de detalles de cada producto** - Precisión en la información

## API Endpoints

El sistema expone los siguientes endpoints:

### `/api/metrics`
Obtiene todas las métricas del dashboard.

**Query Parameters:**
- `days` (opcional, default: 30): Número de días a incluir en el análisis

**Ejemplo:**
```bash
curl http://localhost:3000/api/metrics?days=30
```

### `/api/metrics/leads`
Obtiene información detallada de los leads recientes.

**Query Parameters:**
- `days` (opcional, default: 30): Número de días
- `limit` (opcional, default: 100): Cantidad máxima de leads

**Ejemplo:**
```bash
curl http://localhost:3000/api/metrics/leads?days=7&limit=50
```

### `/api/metrics/conversations`
Obtiene el historial de conversaciones.

**Query Parameters:**
- `session_id` (opcional): ID de sesión específica
- `limit` (opcional, default: 50): Cantidad máxima de conversaciones

**Ejemplo:**
```bash
curl http://localhost:3000/api/metrics/conversations?limit=20
```

## Estructura de la Base de Datos

Las principales tablas utilizadas son:

- **execution_entity** - Información de ejecuciones de workflows
- **n8n_chat_histories** - Historial de conversaciones de chat
- **workflow_entity** - Configuración de workflows

## Troubleshooting

### Error: "Falta la variable de entorno DATABASE_PUBLIC_URL"

**Solución:** Verifica que el archivo `.env.local` existe y contiene la variable `DATABASE_PUBLIC_URL`.

### Error de conexión a la base de datos

**Solución:** 
1. Verifica que la URL de conexión sea correcta
2. Asegúrate de tener acceso a la red de Railway
3. Verifica que el servicio de PostgreSQL esté activo

### Las métricas no se actualizan

**Solución:**
1. Verifica que haya datos en la base de datos de n8n
2. Revisa la consola del navegador para errores
3. Las métricas se actualizan automáticamente cada 5 minutos

## Notas Importantes

⚠️ **Seguridad:** No compartas las credenciales de la base de datos públicamente. El archivo `.env.local` está incluido en `.gitignore` y no debe ser versionado.

⚠️ **Rendimiento:** Las consultas están optimizadas para rangos de 30 días. Rangos mayores pueden afectar el rendimiento.

⚠️ **Conexión SSL:** En producción, la conexión usa SSL con `rejectUnauthorized: false`. En un entorno de alta seguridad, considera configurar certificados SSL apropiados.

## Próximos Pasos

Para mejorar las métricas, considera:

1. Agregar índices a las tablas de n8n para mejorar el rendimiento
2. Implementar caché para reducir la carga en la base de datos
3. Crear dashboards específicos por workflow o cliente
4. Agregar alertas automáticas cuando las métricas caigan por debajo de ciertos umbrales

---

**Última actualización:** Octubre 2025

