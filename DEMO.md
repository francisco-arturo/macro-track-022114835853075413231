# Fit Code Nutrición — demo

## Ejecutar

```powershell
node dev-server.mjs
```

**URL en vivo: https://macro-track-022114835853075413231.vercel.app**

URL local de revisión: **http://127.0.0.1:4174**

El puerto 4173 ya estaba ocupado por otro prototipo en esta máquina, así que la vista previa se
inició con `$env:PORT=4174; node dev-server.mjs`. El servidor escucha en `127.0.0.1`. Detenlo con
`Ctrl+C` en la terminal que ejecuta el proceso.

El despliegue en vivo en español se verificó el 2026-10-27: `/`, `/styles.css`, `/app.js`, `/data.js`,
`/manifest.webmanifest`, `/sw.js` y `/icons/icon-192.png` devuelven 200, el HTML declara `lang="es"`,
y un `POST /api/meal-plan` en vivo devuelve 200 con un plan de tres días (`Día 1`) y uso `1/3`. ID del
despliegue: `dpl_4wtgcTMqBXpJzepqkgFMvq4bgWvT`.

## Recorrido de 60 segundos

1. **Hoy.** La app abre con la sesión de Maya Chen. El día precargado tiene 1,329 kcal, 124 g de
   proteína y una racha de 11 días. Señala el anillo de calorías, la barra de proteína (el macro
   prioritario) y la cena planificada.
2. **Registrar comida.** Toca **Registrar comida**. Elige **Pollo a la parrilla**. Cambia la porción a
   **Porciones con la mano**: una palma equivale a cuatro onzas. Pon dos palmas, elige **Cena** y
   añade. El anillo, las tres barras de macros, la lista de comidas y el texto del inicio se
   actualizan.
3. **Plan de comidas.** Ve a **Plan de comidas**. Cambia el objetivo o la duración y pulsa **Generar
   plan**. La tarjeta muestra la llamada al servidor, el plan nuevo y las generaciones restantes. Los
   desplegables están en listas permitidas y la función nunca devuelve la clave de API.
4. **Progreso.** La tendencia de peso de 8 semanas, las barras de proteína de 7 días y el calendario
   de 14 días vienen precargados. Pulsa **Registrar peso**, escribe 147.9 y guarda; el peso y la
   tendencia se actualizan.
5. **Vista del dueño.** Usa el botón del encabezado. Es la vista `member_summary` que el dueño abrirá
   en Supabase: nombre, días sin registro, racha, proteína de 7 días contra el objetivo y último peso.
   Debajo están el SQL y las notas de RLS.
6. **Cuenta.** Abre el avatar. Exporta el JSON del miembro, prueba **Instalar en este dispositivo** o
   usa el flujo de **Eliminar cuenta** en dos pasos. La eliminación borra los registros locales y
   muestra el estado de cuenta eliminada; **Restaurar la demo** recupera los datos precargados.

## Qué es deliberadamente falso

- **La autenticación es una sesión precargada.** La app abre sin pantalla de login para que el flujo
  del miembro se pueda juzgar en un minuto. Supabase Auth, la recuperación de contraseña y Google son
  trabajo de la Fase 1, no de esta demo.
- **Los datos están en `localStorage`.** No hay un proyecto de Supabase conectado en este prototipo.
  El esquema, las políticas RLS y la vista están documentados y se muestran, pero no conectados.
- **Las filas del dueño son de ejemplo.** La fila de Maya se calcula con el estado local; los otros
  cinco miembros son datos de muestra. La Fase 1 no tiene página de administración: el dueño lee la
  vista en el panel de Supabase.
- **La IA cae en un plan determinista.** Sin `ANTHROPIC_API_KEY`, la ruta del servidor sigue validando,
  midiendo y devolviendo un plan completo de tres días. Con la clave, la misma ruta llama a Anthropic y
  valida el JSON antes de responder. La clave se lee solo en `api/meal-plan.mjs`.
- **El límite de uso es por instancia de función.** Demuestra la barrera y la experiencia. En
  producción el contador vive en Postgres para que un arranque en frío no lo reinicie.
- **La instalación PWA es real en HTTPS.** En localhost el manifiesto y el service worker están
  activos; en Vercel la instalación en pantalla de inicio se comporta como en producción.

## Qué debe juzgar el cliente

- Si registrar por onzas y porciones con la mano se siente más rápido que el prototipo anterior.
- Si la jerarquía de macros se entiende sin leer un número.
- Si la tabla del dueño responde "quién necesita seguimiento" de un vistazo.
- Si el plan es lo bastante concreto para cocinar.
- Si el diseño de iPhone, las áreas seguras y la navegación inferior se sienten como una app.

## Brechas de producción que la demo no esconde

- Migraciones de esquema, políticas RLS y pruebas en Supabase.
- Autenticación real, refresco de sesión, recuperación de contraseña y proveedor de Google.
- Exportación y eliminación del lado del servidor atadas a `auth.uid()`.
- `ai_usage` persistente y aplicación atómica del límite.
- Verificación de la vista de Supabase en el panel con la cuenta del dueño.
