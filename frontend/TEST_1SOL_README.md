# Test de Pago de 1 Sol (S/. 1.00)

Este documento explica cómo probar la integración de Lyra con un pago de 1 Sol Peruano.

## 🚀 Inicio Rápido

### 1. Ejecutar el Servidor de Desarrollo

```bash
npm run dev
```

### 2. Visitar la Página de Prueba

Abre tu navegador y ve a:
```
http://localhost:3000/test-1sol
```

### 3. Probar el Pago

1. Completa el formulario de pago con datos de prueba
2. Usa tarjetas de prueba de Lyra
3. Verifica que el pago se procese correctamente

## 🧪 Scripts de Prueba

### Validar Configuración

```bash
npm run lyra:validate
```

### Probar Integración Completa

```bash
npm run lyra:test
```

### Probar Pago de 1 Sol

```bash
npm run lyra:test-1sol
```

## 💳 Datos de Prueba

### Tarjetas de Prueba de Lyra

Para probar el pago de 1 Sol, usa estas tarjetas de prueba:

- **Visa**: 4111111111111111
- **Mastercard**: 5555555555554444
- **Fecha de vencimiento**: Cualquier fecha futura
- **CVV**: Cualquier código de 3 dígitos

### Información del Pago

- **Monto**: S/. 1.00 (100 centavos)
- **Moneda**: PEN (Sol Peruano)
- **Ambiente**: Producción Lyra
- **Validación**: HMAC-SHA-256

## 🔍 Verificación

### 1. Formulario de Pago

- ✅ Se carga correctamente
- ✅ Muestra el monto de S/. 1.00
- ✅ Campos de tarjeta funcionan
- ✅ Validación en tiempo real

### 2. Procesamiento del Pago

- ✅ Token de formulario se crea
- ✅ Datos se envían a Lyra
- ✅ Respuesta se valida con HMAC
- ✅ Webhook se procesa correctamente

### 3. Resultado

- ✅ Pago exitoso se muestra
- ✅ Datos del pago se registran
- ✅ Error handling funciona
- ✅ Logs se generan correctamente

## 📊 Monitoreo

### Consola del Navegador

Revisa la consola del navegador para ver:
- Logs de inicialización
- Datos del formulario
- Respuestas de la API
- Errores si los hay

### Logs del Servidor

Revisa los logs del servidor para ver:
- Creación de tokens
- Validación de pagos
- Procesamiento de webhooks
- Errores del sistema

## 🛠️ Solución de Problemas

### Error: "Failed to create form token"

1. Verifica que el servidor esté ejecutándose
2. Revisa las credenciales de Lyra
3. Verifica la conexión a la API

### Error: "Invalid signature"

1. Verifica la clave HMAC
2. Revisa el formato de los datos
3. Confirma la configuración de Lyra

### Error: "Payment not successful"

1. Usa tarjetas de prueba válidas
2. Verifica la fecha de vencimiento
3. Revisa los logs de Lyra

## 📈 Próximos Pasos

1. **Probar con diferentes montos**
2. **Validar en diferentes navegadores**
3. **Probar en dispositivos móviles**
4. **Configurar para producción**
5. **Implementar monitoreo avanzado**

## 🔗 Enlaces Útiles

- [Documentación de Lyra](https://docs.lyra.com/)
- [MiCuentaWeb](https://www.micuentaweb.pe/)
- [Página de Prueba](http://localhost:3000/test-1sol)
- [API de Validación](http://localhost:3000/api/lyra/validate)

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs de la consola
2. Verifica la configuración
3. Ejecuta los scripts de prueba
4. Consulta la documentación de Lyra

