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
- `productos`: cada producto tiene `id`, `nombre`, `descripcion`, `precio` (número) e `imagen`. Agregá o quitá objetos siguiendo los ejemplos. Usá `id` únicos y no los cambies una vez que la tienda esté publicada; así se conservan las referencias del carrito.

Para usar tus fotos, copialas en `img/` y cambiá la ruta, por ejemplo: `imagen: "img/mi-foto.jpg"`. Las fotos pueden ser JPG, PNG, WebP o SVG. Recomendación: misma proporción y tamaño aproximado para todos los productos.

**Importante:** mientras el alias y WhatsApp no estén configurados, el botón de WhatsApp estará deshabilitado, para evitar pedidos a datos ficticios.

## 3. Cómo funciona

1. El cliente elige productos y cantidades; el carrito se guarda en el `localStorage` de ese navegador.
2. Puede aumentar, disminuir o quitar artículos. El total se recalcula automáticamente con los **precios actuales** del archivo de configuración.
3. Al pulsar **Pagar por transferencia**, ve el alias, el desglose y el total.
4. Al pulsar **Enviar pedido por WhatsApp**, se abre el chat del vendedor con el pedido y el total precargados.
5. **El cliente debe adjuntar manualmente el comprobante** en WhatsApp. Una web estática no puede añadir el archivo al mensaje por sí sola.

El carrito pertenece a cada navegador/dispositivo. Sin backend no hay control compartido de stock, gestión de pedidos, confirmación automática de transferencias ni sincronización del carrito entre dispositivos. El negocio debe comprobar el pago antes de entregar.

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
