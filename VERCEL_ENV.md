# Variables de Entorno para Vercel

Para deployar correctamente en Vercel, necesitas configurar las siguientes variables de entorno:

## Variables Requeridas

### PostgreSQL (n8n Database)
```
DATABASE_PUBLIC_URL=postgresql://postgres:zUrQI9Q1_QAT~KA8YMiZ5tl~_HYSm~Kn@yamabiko.proxy.rlwy.net:41643/railway
```

### MongoDB (Customers Database)
```
MONGODB_URI=mongodb+srv://admin:admin@cluster01.pxbkzd4.mongodb.net/
MONGODB_DB=AuroraSDR
```

### Next.js (Opcional)
```
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
```

## Cómo Configurar en Vercel

1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Agrega cada variable con su valor correspondiente
4. Selecciona los ambientes: Production, Preview, Development
5. Guarda los cambios
6. Re-deploy el proyecto

## Notas Importantes

- ⚠️ **Nunca** commitees archivos `.env` al repositorio
- 🔐 Las credenciales ya están hardcodeadas en `lib/postgresql.ts` y `lib/mongodb.ts` como fallback
- ✅ Vercel las reemplazará automáticamente cuando estén configuradas
- 🔄 Después de agregar variables, haz re-deploy para que tomen efecto

## Build Command (ya configurado en package.json)
```bash
next build
```

## Output Directory (default de Next.js)
```
.next
```

## Framework Preset
```
Next.js
```

