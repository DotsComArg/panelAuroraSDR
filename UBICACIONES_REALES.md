# 🗺️ Cómo Obtener Ubicaciones Reales en el Dashboard

Actualmente, las ubicaciones mostradas son **estimaciones** porque los números de teléfono no están almacenados en la metadata de n8n.

## 📋 Problema Actual

- La metadata solo contiene **IDs de contacto** del CRM (ej: "25191248")
- No hay números de teléfono con formato internacional (ej: "+525512345678")
- Por eso mostramos una distribución estimada para MAV

## ✅ Solución: Agregar Números a la Metadata

Para tener ubicaciones reales basadas en números de teléfono, necesitas modificar tu workflow de n8n:

### Paso 1: En tu workflow de n8n (MAV)

1. **Ubica el nodo que procesa mensajes nuevos** (probablemente "new message" o similar)

2. **Agrega un nodo "Set" o "Execution Data"** después de recibir el webhook

3. **Guarda el número de teléfono en la metadata:**

```javascript
// En un nodo "Code" o "Function"
const phoneNumber = $input.item.json.body['message[add][0][contact][phone]'];
// O la estructura que use tu webhook para el teléfono

// Guardar en metadata
$execution.customData.set('phone_number', phoneNumber);
```

### Paso 2: Alternativa con nodo "Execution Data"

Si usas el nodo "Execution Data":

```
Key: phone_number
Value: {{ $json.contact.phone }} // O donde esté el teléfono en tu webhook
```

### Paso 3: Formato del Número

Asegúrate de que el número tenga formato internacional:
- ✅ **Correcto:** "+525512345678" (México)
- ✅ **Correcto:** "+5491112345678" (Argentina)  
- ✅ **Correcto:** "+573001234567" (Colombia)
- ❌ **Incorrecto:** "5512345678"
- ❌ **Incorrecto:** "11 1234-5678"

### Paso 4: Estructura del Webhook

Si estás usando AmoCRM/Kommo, el número puede estar en:
```
message[add][0][author][phone]
// o
contact[phone]
// o
custom_fields[phone]
```

## 🔧 Código de Referencia para n8n

### Opción 1: En un nodo "Function"

```javascript
// Obtener el número de teléfono del webhook
const webhookData = $input.all()[0].json;
let phoneNumber = null;

// Intentar diferentes ubicaciones comunes
if (webhookData.body && webhookData.body.contact && webhookData.body.contact.phone) {
  phoneNumber = webhookData.body.contact.phone;
} else if (webhookData.phone) {
  phoneNumber = webhookData.phone;
}

// Normalizar formato (agregar + si no lo tiene)
if (phoneNumber && !phoneNumber.startsWith('+')) {
  phoneNumber = '+' + phoneNumber;
}

// Guardar en metadata
if (phoneNumber) {
  $execution.customData.set('phone_number', phoneNumber);
}

return $input.all();
```

### Opción 2: Con nodo "Set"

1. Crea un nodo "Set" 
2. Agrega operación "Add Field"
3. Nombre: `phone_number`
4. Valor: `{{ $json.contact.phone }}` (ajusta según tu estructura)

## 📊 Una Vez Configurado

Después de guardar números en la metadata con key `phone_number`:

1. El dashboard detectará automáticamente los números
2. Extraerá los códigos de país (+54, +52, etc.)
3. Mostrará la distribución real por país
4. Actualizará los porcentajes basados en datos reales

## 🌍 Países Detectados Automáticamente

- 🇲🇽 México (+52)
- 🇦🇷 Argentina (+54)
- 🇨🇴 Colombia (+57)
- 🇪🇸 España (+34)
- 🇨🇱 Chile (+56)
- 🇵🇪 Perú (+51)
- 🇧🇷 Brasil (+55)
- 🇪🇨 Ecuador (+593)
- 🇨🇷 Costa Rica (+506)
- 🇵🇦 Panamá (+507)
- Y más...

## ❓ ¿Necesitas Ayuda?

Si no encuentras dónde está el número de teléfono en tu webhook:

1. Agrega un nodo "Code" temporal con:
```javascript
console.log('Webhook completo:', JSON.stringify($input.all()[0].json, null, 2));
return $input.all();
```

2. Ejecuta el workflow
3. Revisa los logs de n8n para ver la estructura completa
4. Busca campos que contengan "phone", "telefono", "celular" o números con "+"

---

**Nota:** Mientras tanto, el dashboard muestra una distribución estimada basada en el mercado típico de MAV (México/Latinoamérica).

