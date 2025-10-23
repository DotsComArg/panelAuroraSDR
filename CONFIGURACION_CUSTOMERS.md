# 👥 Sistema de Gestión de Customers

## 🎯 Descripción

Sistema completo para gestionar clientes (customers) de Aurora SDR IA, con integración a MongoDB.

## 📋 Estructura de Datos

### Customer Schema

```typescript
{
  _id: ObjectId,
  nombre: string,
  apellido: string,
  email: string (único),
  telefono: string,
  pais: string,
  cantidadAgentes: number,
  planContratado: 'Básico' | 'Profesional' | 'Enterprise' | 'Custom',
  fechaInicio: Date,
  twoFactorAuth: boolean,
  rol: 'Cliente' | 'Owner',
  createdAt: Date,
  updatedAt: Date
}
```

## 🗄️ Base de Datos

- **URI**: `mongodb+srv://admin:admin@cluster01.pxbkzd4.mongodb.net/`
- **Database**: `AuroraSDR`
- **Colección**: `customers`

## 🚀 Inicializar Base de Datos

Para crear los customers iniciales (Aurora SDR IA como Owner y Academia MAV como Cliente):

```bash
npm run init-customers
```

Este script creará:

### 1. **Aurora SDR IA** (Owner)
- Email: admin@aurorasdr.ai
- Rol: Owner
- Plan: Custom
- Agentes: 100 (ilimitados)
- 2FA: Activado

### 2. **Academia MAV** (Cliente)
- Email: contacto@academiamav.com
- Rol: Cliente
- Plan: Profesional
- Agentes: 1
- 2FA: Desactivado

## 🔌 API Endpoints

### Obtener todos los customers
```bash
GET /api/customers
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "nombre": "Aurora",
      "apellido": "SDR IA",
      "email": "admin@aurorasdr.ai",
      ...
    }
  ]
}
```

### Obtener un customer específico
```bash
GET /api/customers/[id]
```

### Crear un nuevo customer
```bash
POST /api/customers
Content-Type: application/json

{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@example.com",
  "telefono": "+54 11 1234-5678",
  "pais": "Argentina",
  "cantidadAgentes": 2,
  "planContratado": "Profesional",
  "fechaInicio": "2024-03-01",
  "twoFactorAuth": false,
  "rol": "Cliente"
}
```

### Actualizar un customer
```bash
PUT /api/customers/[id]
Content-Type: application/json

{
  "nombre": "Juan Carlos",
  "cantidadAgentes": 3
}
```

### Eliminar un customer
```bash
DELETE /api/customers/[id]
```

## 📄 Página de Configuración

La página `/configuracion` consume y muestra los datos del customer:

### Funcionalidades:
- ✅ Cargar datos del customer desde MongoDB
- ✅ Editar información personal (nombre, apellido, email, teléfono, país)
- ✅ Actualizar cantidad de agentes
- ✅ Cambiar plan contratado
- ✅ Activar/desactivar 2FA
- ✅ Ver información de membresía
- ✅ Ver resumen de cuenta

### Campos Editables:
- Nombre
- Apellido
- Email
- Teléfono
- País
- Cantidad de agentes
- Plan contratado
- 2FA

### Campos de Solo Lectura:
- Rol (Cliente/Owner)
- Fecha de inicio
- Fecha de creación
- Última actualización

## 🔒 Roles

### Owner (Propietario)
- **Permisos**: Acceso completo al sistema
- **Características**:
  - Gestión completa de clientes
  - Configuración global
  - Administración de usuarios
  - Reportes avanzados
  - Sin límite de agentes

### Cliente
- **Permisos**: Acceso a su dashboard y métricas
- **Características**:
  - Dashboard de métricas
  - Visualización de leads
  - Reportes de rendimiento
  - Gestión de ubicaciones
  - Límite de agentes según plan contratado

## 📊 Planes Disponibles

| Plan | Agentes | Características |
|------|---------|----------------|
| **Básico** | 1-3 | Dashboard básico, reportes mensuales |
| **Profesional** | 1-10 | Dashboard completo, reportes semanales, soporte prioritario |
| **Enterprise** | 10-50 | Todo lo anterior + API access, integraciones custom |
| **Custom** | Sin límite | Solución personalizada para necesidades específicas |

## 🔐 Autenticación de Dos Factores (2FA)

Los customers pueden activar 2FA desde la página de configuración:

```typescript
// En el componente de configuración
<Switch 
  checked={formData.twoFactorAuth}
  onCheckedChange={(checked) => setFormData({...formData, twoFactorAuth: checked})}
/>
```

## 🛠️ Desarrollo

### Agregar nuevos campos al Customer

1. **Actualizar tipos** en `lib/customer-types.ts`:
```typescript
export interface Customer {
  // ... campos existentes
  nuevoCampo: string;
}
```

2. **Actualizar API routes** en `app/api/customers/*`:
```typescript
if (body.nuevoCampo) updateFields.nuevoCampo = body.nuevoCampo;
```

3. **Actualizar UI** en `app/(dashboard)/configuracion/page.tsx`:
```tsx
<Input 
  value={formData.nuevoCampo}
  onChange={(e) => setFormData({...formData, nuevoCampo: e.target.value})}
/>
```

## 📝 Notas Importantes

1. **Email único**: Cada customer debe tener un email único
2. **Rol Owner**: Solo debe haber 1 owner en el sistema (Aurora SDR IA)
3. **Validaciones**: Los campos nombre, apellido y email son obligatorios
4. **Fechas**: Se almacenan como Date objects en MongoDB
5. **2FA**: Por defecto está desactivado, el customer debe activarlo manualmente

## 🔄 Flujo de Trabajo

1. **Inicializar DB**: `npm run init-customers`
2. **Acceder a configuración**: Ir a `/configuracion`
3. **Ver datos**: Los datos del customer se cargan automáticamente
4. **Editar información**: Modificar campos y hacer clic en "Guardar Cambios"
5. **Actualización**: Los cambios se guardan en MongoDB y se reflejan en la UI

## 🐛 Troubleshooting

### Error: "No se encontró información del cliente"
- **Solución**: Ejecutar `npm run init-customers` para crear los customers iniciales

### Error: "El email ya está registrado"
- **Solución**: Cada email debe ser único, usar otro email

### Error de conexión a MongoDB
- **Solución**: Verificar que la URI de MongoDB sea correcta y que tengas acceso a internet

## 📞 Soporte

Para cualquier duda o problema, contacta a: admin@aurorasdr.ai

