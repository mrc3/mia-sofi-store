# Catálogo y carrito — Tienda estática

Página mobile-first, sin backend ni dependencias, hecha con HTML, CSS y JavaScript puro.

## 1. Cómo abrir la tienda

Descomprimí el ZIP y abrí `index.html` en Chrome, Firefox o Edge.
Para verla desde otro dispositivo en tu misma red, podés levantar un servidor local con `python -m http.server 8000` dentro de la carpeta y entrar a `http://IP_DE_TU_PC:8000`.

## 2. Cómo configurar

Editá **solo `config.js`** para los cambios habituales:

- `negocio.nombre`: nombre visible de la tienda.
- `negocio.lema`: texto destacado de presentación.
- `negocio.aliasTransferencia`: reemplazá `TU_ALIAS_AQUI` por el alias real de tu cuenta.
- `negocio.whatsapp`: número **del vendedor** en formato internacional, sin `+`, guiones ni espacios. Por ejemplo, para Paraguay, `595981123456` es *solo un ejemplo de formato*, **no** un número al que debas enviar clientes.
- `negocio.moneda` y `negocio.idioma`: por defecto se usan guaraníes y formato de Paraguay.
- `productos`: cada producto tiene `id`, `nombre`, `descripcion`, `precio` (número), `imagen` y `categoria` (una o varias). Usá `id` únicos y no los cambies una vez publicada la tienda, para conservar el carrito.
- `destacado: true` incluye el producto en la selección destacada; `novedad: true` lo marca para el filtro y el orden de novedades.
- `stock`: usá un entero para mostrar unidades, `0` para agotado; si se omite, el catálogo indica que hay que consultar disponibilidad y no inventa cantidades.
- `imagenes`: lista opcional de rutas adicionales para activar la galería. Por ejemplo, `imagenes: ["img/foto-frente.webp", "img/foto-detalle.webp"]`.
- `negocio.costosEntrega`: costos en guaraníes por modalidad. `retiro: 0` indica retiro sin costo; `local: null`, `interiorNsa: null` e `interiorTsi: null` muestran “A coordinar” hasta definir tarifas.

Para usar tus fotos, copialas en `img/` y cambiá la ruta de `imagen`; agregá más tomas a `imagenes`. Se admiten JPG, PNG, WebP, AVIF y SVG. Priorizá WebP/AVIF comprimidos, buena iluminación y una proporción consistente.

**Importante:** mientras el alias y WhatsApp no estén configurados, el botón de WhatsApp estará deshabilitado, para evitar pedidos a datos ficticios.

## 3. Cómo funciona

1. El cliente puede buscar, filtrar y ordenar productos; el carrito se guarda en el `localStorage` de ese navegador.
2. El checkout revisa el pedido, solicita modalidad y datos de entrega, y luego muestra Ueno y el alias.
3. Si una tarifa es `null`, se informa “A coordinar” y el monto final queda pendiente de confirmación por WhatsApp.
4. El botón **Enviar pedido por WhatsApp** incluye artículos, cantidades, subtotal y los datos de entrega.
5. **El cliente debe adjuntar manualmente el comprobante** en WhatsApp; una web estática no puede adjuntar archivos por sí sola.

El carrito pertenece a cada navegador/dispositivo. Sin backend no hay reserva compartida de stock, gestión central de pedidos, confirmación automática de transferencias ni sincronización entre dispositivos. El negocio debe comprobar el pago antes de entregar.

## 4. Cómo publicar sin servidor propio

**Netlify Drop (fácil):** después de editar `config.js`, entrá en https://app.netlify.com/drop y arrastrá la carpeta `tienda_catalogo` (la que contiene `index.html`) para publicar. Guardá tu sitio en una cuenta si querés administrarlo y actualizarlo después.

**GitHub Pages:** creá un repositorio, subí el contenido de esta carpeta a la raíz de la rama `main`, y en `Settings > Pages` elegí `Deploy from a branch`, rama `main`, carpeta `/(root)`. Guardá y esperá la publicación.

Para actualizar productos o precios, editá `config.js` y volvé a desplegar la carpeta o subí el cambio a tu repositorio.

## 5. Archivos

- `index.html`: estructura de la página.
- `styles.css`: diseño responsive, mobile-first.
- `config.js`: negocio, alias, número y catálogo (el archivo que vas a editar).
- `app.js`: lógica del carrito, localStorage, totales y WhatsApp.
- `img/`: imágenes de muestra editables.

No publiques datos sensibles en `config.js`: todo este archivo es público, como corresponde a una tienda estática. El alias y teléfono comercial son datos que verán los clientes.
