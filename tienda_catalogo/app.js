(() => {
  "use strict";

  const config = window.TIENDA_CONFIG;
  if (!config || !config.negocio || !Array.isArray(config.productos)) {
    document.getElementById("productGrid").textContent = "Falta configurar la tienda en config.js.";
    return;
  }

  const STORAGE_KEY = "carrito_tienda_v1";
  const MAX_QTY = 99;
  const negocio = config.negocio;
  const productos = config.productos.filter(p =>
    p && typeof p.id === "string" && p.id.trim() &&
    typeof p.nombre === "string" && Number.isFinite(p.precio) && p.precio >= 0
  );
  const porId = new Map(productos.map(p => [p.id, p]));
  const $ = (id) => document.getElementById(id);
  const cart = cargarCarrito();
  let checkoutStep = 0;
  let toastTimer;
  let mobileCartOpen = false;
  let categoriaActiva = "todo";
  let consulta = "";
  let orden = "destacados";

  const formato = new Intl.NumberFormat(negocio.idioma || "es-PY", {
    style: "currency", currency: negocio.moneda || "PYG"
  });
  const dinero = n => formato.format(n);
  const texto = (tag, clase, contenido) => {
    const node = document.createElement(tag);
    if (clase) node.className = clase;
    if (contenido !== undefined) node.textContent = String(contenido);
    return node;
  };
  const cantidadValida = (v) => Math.max(1, Math.min(MAX_QTY, Math.trunc(Number(v) || 1)));
  const total = () => Object.entries(cart).reduce((sum, [id, qty]) => sum + (porId.get(id)?.precio || 0) * qty, 0);
  const unidades = () => Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const costoEntrega = () => {
    const metodo = $("deliveryMethod").value;
    const costos = negocio.costosEntrega || {};
    const clave = metodo === "interior-nsa" ? "interiorNsa" : metodo === "interior-tsi" ? "interiorTsi" : metodo;
    const costo = Object.prototype.hasOwnProperty.call(costos, clave)
      ? costos[clave]
      : metodo.startsWith("interior-") ? costos.interior : undefined;
    return Number.isFinite(costo) && costo >= 0 ? costo : null;
  };
  const telefonoWhatsApp = () => String(negocio.whatsapp || "").replace(/\D/g, "");
  function stockDe(p) {
    return Number.isInteger(p.stock) && p.stock >= 0 ? p.stock : null;
  }
  const esNovedad = p => p.novedad === true || String(p.badge || "").toLowerCase() === "nuevo";
  const esDestacado = p => p.destacado === true;
  const imagenesDe = p => Array.isArray(p.imagenes) && p.imagenes.length
    ? p.imagenes.filter(ruta => typeof ruta === "string" && ruta.trim())
    : [p.imagen || "img/sin-imagen.svg"];

  function cargarCarrito() {
    try {
      const guardado = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      if (!guardado || typeof guardado !== "object" || Array.isArray(guardado)) return {};
      const limpio = {};
      for (const [id, qty] of Object.entries(guardado)) {
        if (!porId.has(id) || !Number.isInteger(qty) || qty <= 0) continue;
        const stock = stockDe(porId.get(id));
        if (stock !== 0) limpio[id] = Math.min(qty, MAX_QTY, stock ?? MAX_QTY);
      }
      return limpio;
    } catch (_) {
      // En navegación privada o con almacenamiento bloqueado, la tienda sigue funcionando.
      return {};
    }
  }

  function guardar() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); }
    catch (_) { mostrarAviso("No se pudo guardar el carrito en este navegador."); }
  }

  function mostrarAviso(mensaje) {
    const aviso = $("toast");
    aviso.textContent = mensaje;
    aviso.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => aviso.classList.remove("show"), 2600);
  }

  function actualizarCantidad(id, qty) {
    if (!porId.has(id)) return;
    const stock = stockDe(porId.get(id));
    if (qty <= 0 || stock === 0) delete cart[id];
    else cart[id] = Math.min(cantidadValida(qty), stock ?? MAX_QTY);
    if (!unidades()) checkoutStep = 0;
    guardar();
    renderCarrito();
  }

  function agregar(id, cantidad) {
    const producto = porId.get(id);
    if (!producto) return;
    const anterior = cart[id] || 0;
    const stock = stockDe(producto);
    if (stock === 0) {
      mostrarAviso("Este producto está agotado.");
      return;
    }
    cart[id] = Math.min(stock ?? MAX_QTY, anterior + cantidadValida(cantidad));
    guardar();
    renderCarrito();
    mostrarAviso(`${producto.nombre} agregado al carrito`);
  }

  function crearTarjeta(p, fijarAncla = false) {
    const tarjeta = texto("article", "product-card");
    tarjeta.dataset.productId = p.id;
    if (fijarAncla) tarjeta.id = `producto-${p.id}`;
    const rutas = imagenesDe(p);
    const imagenCont = texto("div", "product-image-wrap");
    const badge = texto("span", "product-badge", p.badge || "Nuevo");
    const imagen = texto("img", "product-image");
    let imagenActual = 0;
    imagen.src = rutas[imagenActual];
    imagen.alt = `Imagen de ${p.nombre}`;
    imagen.loading = "lazy";
    imagen.addEventListener("error", () => {
      if (!imagen.src.endsWith("sin-imagen.svg")) imagen.src = "img/sin-imagen.svg";
    });
    imagenCont.append(badge, imagen);
    if (rutas.length > 1) {
      const controlesGaleria = texto("div", "gallery-controls");
      const anterior = texto("button", "gallery-arrow", "‹");
      anterior.type = "button";
      anterior.setAttribute("aria-label", `Foto anterior de ${p.nombre}`);
      const siguiente = texto("button", "gallery-arrow", "›");
      siguiente.type = "button";
      siguiente.setAttribute("aria-label", `Foto siguiente de ${p.nombre}`);
      const contador = texto("span", "gallery-count", `1 / ${rutas.length}`);
      const cambiarImagen = delta => {
        imagenActual = (imagenActual + delta + rutas.length) % rutas.length;
        imagen.src = rutas[imagenActual];
        contador.textContent = `${imagenActual + 1} / ${rutas.length}`;
      };
      anterior.addEventListener("click", () => cambiarImagen(-1));
      siguiente.addEventListener("click", () => cambiarImagen(1));
      controlesGaleria.append(anterior, siguiente);
      imagenCont.append(controlesGaleria, contador);
    }
    const cuerpo = texto("div", "product-body");
    cuerpo.append(texto("h3", "product-name", p.nombre));
    cuerpo.append(texto("p", "product-description", p.descripcion || ""));
    const stock = stockDe(p);
    const estadoStock = stock === 0 ? "Agotado" : stock === null ? "Consultar disponibilidad" : `${stock} disponibles`;
    const claseStock = stock === 0 ? " out-of-stock" : stock === null ? " unknown" : "";
    cuerpo.append(texto("span", `product-availability${claseStock}`, estadoStock));
    cuerpo.append(texto("div", "product-price", dinero(p.precio)));
    const tools = texto("div", "product-tools");
    const compartir = texto("button", "share-button");
    compartir.type = "button";
    compartir.setAttribute("aria-label", `Compartir ${p.nombre}`);
    compartir.title = `Compartir ${p.nombre}`;
    compartir.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.7 6.8-4.4M8.6 13.3l6.8 4.4"/></svg>';
    compartir.addEventListener("click", () => compartirProducto(p));
    tools.append(compartir);
    cuerpo.append(tools);
    const acciones = texto("div", "product-actions");
    const cantidadWrap = texto("label", "quantity-field");
    const campo = document.createElement("input");
    campo.type = "number";
    campo.min = "1";
    campo.max = String(stock ?? MAX_QTY);
    campo.step = "1";
    campo.value = "1";
    campo.inputMode = "numeric";
    campo.disabled = stock === 0;
    campo.setAttribute("aria-label", `Cantidad de ${p.nombre}`);
    cantidadWrap.append(campo);
    const boton = texto("button", "button button-primary add-button", stock === 0 ? "Agotado" : "Agregar +");
    boton.type = "button";
    boton.disabled = stock === 0;
    boton.setAttribute("aria-label", `${stock === 0 ? "Producto agotado" : "Agregar"} ${p.nombre} al carrito`);
    boton.addEventListener("click", () => {
      const qty = cantidadValida(campo.value);
      campo.value = String(qty);
      agregar(p.id, qty);
    });
    acciones.append(cantidadWrap, boton);
    cuerpo.append(acciones);
    tarjeta.append(imagenCont, cuerpo);
    return tarjeta;
  }

  function compartirProducto(p) {
    const url = `${location.origin}${location.pathname}#producto-${encodeURIComponent(p.id)}`;
    const datos = { title: p.nombre, text: `${p.nombre} en ${negocio.nombre}`, url };
    if (navigator.share) {
      navigator.share(datos).catch(() => {});
      return;
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url)
        .then(() => mostrarAviso("Enlace del producto copiado."))
        .catch(() => mostrarAviso(url));
      return;
    }
    mostrarAviso(url);
  }

  function filtrarProductos() {
    const termino = consulta.trim().toLocaleLowerCase("es");
    const filtrados = productos.filter(p => {
      const categorias = Array.isArray(p.categoria) ? p.categoria : [p.categoria].filter(Boolean);
      const coincideCategoria = categoriaActiva === "todo" ||
        (categoriaActiva === "novedades" ? esNovedad(p) : categorias.includes(categoriaActiva));
      const coincideTexto = !termino || `${p.nombre} ${p.descripcion || ""} ${p.badge || ""}`.toLocaleLowerCase("es").includes(termino);
      return coincideCategoria && coincideTexto;
    });
    if (orden === "precio-asc") filtrados.sort((a, b) => a.precio - b.precio);
    if (orden === "precio-desc") filtrados.sort((a, b) => b.precio - a.precio);
    if (orden === "novedades") filtrados.sort((a, b) => Number(esNovedad(b)) - Number(esNovedad(a)));
    if (orden === "destacados") filtrados.sort((a, b) => Number(esDestacado(b)) - Number(esDestacado(a)));
    return filtrados;
  }

  function renderProductos() {
    const grilla = $("productGrid");
    grilla.replaceChildren();
    const filtrados = filtrarProductos();
    $("productCounter").textContent = `${filtrados.length} producto${filtrados.length === 1 ? "" : "s"}`;
    for (const p of filtrados) grilla.append(crearTarjeta(p, true));
    if (!filtrados.length) grilla.append(texto("p", "empty-results", "No encontramos productos con esos filtros."));
    const destacados = productos.filter(esDestacado);
    $("featuredSection").hidden = !destacados.length || Boolean(consulta) || categoriaActiva !== "todo";
    const destacadosGrid = $("featuredGrid");
    destacadosGrid.replaceChildren(...destacados.map(p => crearTarjeta(p)));
  }

  function renderCarrito() {
    const contenedor = $("cartItems");
    contenedor.replaceChildren();
    const entries = Object.entries(cart).filter(([id, qty]) => porId.has(id) && qty > 0);
    const count = unidades();
    const monto = dinero(total());
    $("headerCartCount").textContent = count;
    $("asideCartCount").textContent = count;
    $("mobileCartCount").textContent = `(${count})`;
    $("mobileCartTotal").textContent = monto;
    $("mobileCartShortcut").hidden = count === 0 || mobileCartOpen;
    $("cartFooter").hidden = count === 0 || checkoutStep > 0;
    $("cartTotal").textContent = monto;
    $("mobileCartShortcut").setAttribute("aria-expanded", String(mobileCartOpen));
    $("cartBackdrop").hidden = !mobileCartOpen;
    $("carrito").classList.toggle("is-mobile-open", mobileCartOpen);
    $("carrito").classList.toggle("checkout-started", checkoutStep > 0);
    $("cartItems").hidden = checkoutStep > 0;
    document.body.classList.toggle("cart-open", mobileCartOpen);

    if (!entries.length) {
      const empty = texto("div", "cart-empty");
      empty.append(texto("div", "empty-icon", "🛍️"), texto("h3", "", "Tu carrito está vacío"));
      empty.append(texto("p", "", "Sumá tus productos favoritos para empezar."));
      const link = texto("a", "", "Explorar productos");
      link.href = "#catalogo";
      empty.append(link);
      contenedor.append(empty);
    }

    for (const [id, qty] of entries) {
      const p = porId.get(id);
      const fila = texto("div", "cart-row");
      const img = texto("img", "cart-thumb");
      img.src = p.imagen || "img/sin-imagen.svg";
      img.alt = "";
      img.loading = "lazy";
      img.addEventListener("error", () => {
        if (!img.src.endsWith("sin-imagen.svg")) img.src = "img/sin-imagen.svg";
      });
      const detalles = texto("div", "");
      detalles.append(texto("p", "cart-item-name", p.nombre), texto("p", "cart-item-price", `${dinero(p.precio)} c/u`));
      const controles = texto("div", "cart-line-controls");
      const stepper = texto("div", "stepper");
      const menos = texto("button", "", "−");
      menos.type = "button";
      menos.setAttribute("aria-label", `Quitar una unidad de ${p.nombre}`);
      menos.addEventListener("click", () => actualizarCantidad(id, qty - 1));
      const numero = texto("span", "", qty);
      numero.setAttribute("aria-label", `Cantidad: ${qty}`);
      const mas = texto("button", "", "+");
      mas.type = "button";
      mas.setAttribute("aria-label", `Agregar una unidad de ${p.nombre}`);
      mas.disabled = qty >= MAX_QTY;
      mas.addEventListener("click", () => actualizarCantidad(id, qty + 1));
      stepper.append(menos, numero, mas);
      const quitar = texto("button", "remove-button", "Quitar");
      quitar.type = "button";
      quitar.setAttribute("aria-label", `Eliminar ${p.nombre} del carrito`);
      quitar.addEventListener("click", () => actualizarCantidad(id, 0));
      controles.append(stepper, quitar, texto("strong", "line-price", dinero(qty * p.precio)));
      detalles.append(controles);
      fila.append(img, detalles);
      contenedor.append(fila);
    }
    $("paymentPanel").hidden = checkoutStep === 0 || !count;
    $("payButton").setAttribute("aria-expanded", String(checkoutStep > 0));
    if (checkoutStep > 0 && count) renderCheckout();
  }

  function renderCheckout() {
    $("checkoutReview").hidden = checkoutStep !== 1;
    $("deliveryForm").hidden = checkoutStep !== 2;
    $("paymentStep").hidden = checkoutStep !== 3;
    document.querySelectorAll("[data-step-indicator]").forEach((step, index) => {
      step.classList.toggle("active", index + 1 === checkoutStep);
      step.classList.toggle("complete", index + 1 < checkoutStep);
    });
    const resumen = $("checkoutItems");
    const pagoResumen = $("paymentItems");
    resumen.replaceChildren();
    pagoResumen.replaceChildren();
    const lineas = [];
    for (const [id, qty] of Object.entries(cart)) {
      const producto = porId.get(id);
      if (!producto || qty < 1) continue;
      const linea = `${qty} × ${producto.nombre}`;
      const importe = dinero(producto.precio * qty);
      for (const destino of [resumen, pagoResumen]) {
        const li = document.createElement("li");
        li.append(texto("span", "", linea), texto("span", "", importe));
        destino.append(li);
      }
      lineas.push(`• ${linea}: ${importe}`);
    }
    $("checkoutSubtotal").textContent = dinero(total());
    $("paymentSubtotal").textContent = dinero(total());
    const metodo = $("deliveryMethod").value;
    const costo = costoEntrega();
    const textoCosto = costo === null ? "A coordinar" : costo === 0 ? "Sin costo" : dinero(costo);
    $("deliveryCost").textContent = textoCosto;
    $("paymentDeliveryFee").textContent = textoCosto;
    $("paymentTotal").textContent = costo === null ? "A confirmar" : dinero(total() + costo);
    const requiereDestino = metodo !== "retiro";
    $("deliveryLocationField").hidden = !requiereDestino;
    $("deliveryLocation").required = requiereDestino;
    const esInterior = metodo.startsWith("interior-");
    $("deliveryLocation").placeholder = esInterior ? "Ciudad y departamento" : "Calle, número y barrio";
    const alias = String(negocio.aliasTransferencia || "").trim();
    const aliasConfigurado = Boolean(alias && alias !== "TU_ALIAS_AQUI");
    $("transferAlias").textContent = alias || "TU_ALIAS_AQUI";
    $("copyAliasButton").disabled = !aliasConfigurado;
    $("aliasWarning").hidden = aliasConfigurado;
    const telefono = telefonoWhatsApp();
    const whatsappConfigurado = /^\d{10,15}$/.test(telefono);
    const nombre = $("customerName").value.trim();
    const contacto = $("customerPhone").value.trim();
    const destino = $("deliveryLocation").value.trim();
    const notas = $("deliveryNotes").value.trim();
    const etiquetaEntrega = metodo === "retiro" ? "Retiro coordinado" :
      metodo === "local" ? `Entrega local: ${destino}` :
        `Envío al interior por ${metodo === "interior-nsa" ? "NSA" : "TSI"}: ${destino}`;
    $("paymentDeliveryMethod").textContent = `${etiquetaEntrega} · ${nombre} · ${contacto}`;
    const totalFinal = costo === null ? "A confirmar con el costo de entrega" : dinero(total() + costo);
    const mensaje = [
      `¡Hola! Quiero confirmar este pedido de ${negocio.nombre}:`,
      `Cliente: ${nombre}`,
      `Contacto: ${contacto}`,
      `Entrega: ${etiquetaEntrega}`,
      ...(notas ? [`Indicaciones: ${notas}`] : []),
      "",
      ...lineas,
      `Subtotal productos: ${dinero(total())}`,
      `Costo de entrega: ${textoCosto}`,
      `TOTAL: ${totalFinal}`,
      `Transferencia a Ueno, alias: ${alias}`,
      "Adjuntaré el comprobante en este chat."
    ].join("\n");
    const link = $("whatsappButton");
    const datosValidos = $("deliveryForm").checkValidity();
    link.href = whatsappConfigurado && aliasConfigurado && datosValidos
      ? `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`
      : "#carrito";
    link.setAttribute("aria-disabled", String(!(whatsappConfigurado && aliasConfigurado && datosValidos)));
    link.tabIndex = whatsappConfigurado && aliasConfigurado && datosValidos ? 0 : -1;
    $("whatsappWarning").hidden = whatsappConfigurado && aliasConfigurado && datosValidos;
    $("whatsappWarning").textContent = !aliasConfigurado
      ? "Configurá el alias real en config.js antes de recibir pedidos."
      : !whatsappConfigurado
        ? "Configurá tu número de WhatsApp en config.js para habilitar este botón."
        : "Completá los datos de entrega para preparar el pedido.";
  }

  function configurarNegocio() {
    const nombre = negocio.nombre || "Tu tienda";
    $("brandName").textContent = nombre;
    $("footerName").textContent = nombre;
    document.title = `${nombre} | Catálogo y carrito`;
    const contacto = telefonoWhatsApp();
    if (/^\d{10,15}$/.test(contacto)) {
      $("headerContact").href = `https://wa.me/${contacto}`;
      $("headerContact").hidden = false;
    }
    if (negocio.lema) $("storeTagline").textContent = negocio.lema + ". Elegí, agregá al carrito y coordiná tu compra.";
    $("copyAliasButton").addEventListener("click", async () => {
      const alias = String(negocio.aliasTransferencia || "").trim();
      if (!alias || alias === "TU_ALIAS_AQUI") return;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(alias);
        } else {
          const input = document.createElement("textarea");
          input.value = alias;
          input.style.position = "fixed";
          input.style.opacity = "0";
          document.body.append(input);
          input.select();
          let copiado = false;
          try { copiado = document.execCommand("copy"); }
          finally { input.remove(); }
          if (!copiado) throw new Error("No se pudo copiar");
        }
        mostrarAviso("Alias copiado al portapapeles");
      } catch (_) {
        mostrarAviso("No se pudo copiar. Seleccioná el alias para copiarlo.");
      }
    });
  }

  function setMobileCartOpen(open) {
    mobileCartOpen = open && window.matchMedia("(max-width: 979px)").matches;
    renderCarrito();
  }

  function configurarCheckout() {
    $("backToCartButton").addEventListener("click", () => {
      checkoutStep = 0;
      renderCarrito();
    });
    $("payButton").addEventListener("click", () => {
      checkoutStep = 1;
      renderCarrito();
    });
    $("toDeliveryButton").addEventListener("click", () => {
      checkoutStep = 2;
      renderCarrito();
      $("customerName").focus();
    });
    $("backToReviewButton").addEventListener("click", () => {
      checkoutStep = 1;
      renderCarrito();
    });
    $("backToDeliveryButton").addEventListener("click", () => {
      checkoutStep = 2;
      renderCarrito();
    });
    $("deliveryMethod").addEventListener("change", renderCheckout);
    $("deliveryForm").addEventListener("input", () => {
      if (checkoutStep === 3) renderCheckout();
    });
    $("deliveryForm").addEventListener("submit", evento => {
      evento.preventDefault();
      if (!$("deliveryForm").reportValidity()) return;
      checkoutStep = 3;
      renderCarrito();
    });
    $("mobileCartShortcut").addEventListener("click", () => setMobileCartOpen(true));
    $("closeCart").addEventListener("click", () => setMobileCartOpen(false));
    $("cartBackdrop").addEventListener("click", () => setMobileCartOpen(false));
    $("headerCartLink").addEventListener("click", evento => {
      if (!window.matchMedia("(max-width: 979px)").matches) return;
      evento.preventDefault();
      setMobileCartOpen(true);
    });
  }

  function configurarCatalogo() {
    document.querySelectorAll("[data-category]").forEach(boton => {
      boton.addEventListener("click", () => {
        categoriaActiva = boton.dataset.category;
        document.querySelectorAll("[data-category]").forEach(item => {
          item.classList.toggle("active", item === boton);
        });
        renderProductos();
      });
    });
    $("searchInput").addEventListener("input", evento => {
      consulta = evento.currentTarget.value;
      renderProductos();
    });
    $("sortSelect").addEventListener("change", evento => {
      orden = evento.currentTarget.value;
      renderProductos();
    });
  }

  configurarNegocio();
  configurarCheckout();
  configurarCatalogo();
  renderProductos();
  renderCarrito();
})();
