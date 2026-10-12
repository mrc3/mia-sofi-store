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
  let paymentVisible = false;
  let toastTimer;

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

  function cargarCarrito() {
    try {
      const guardado = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      if (!guardado || typeof guardado !== "object" || Array.isArray(guardado)) return {};
      const limpio = {};
      for (const [id, qty] of Object.entries(guardado)) {
        if (porId.has(id) && Number.isInteger(qty) && qty > 0) limpio[id] = Math.min(qty, MAX_QTY);
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
    if (qty <= 0) delete cart[id];
    else cart[id] = cantidadValida(qty);
    if (!unidades()) paymentVisible = false;
    guardar();
    renderCarrito();
  }

  function agregar(id, cantidad) {
    const producto = porId.get(id);
    if (!producto) return;
    const anterior = cart[id] || 0;
    cart[id] = Math.min(MAX_QTY, anterior + cantidadValida(cantidad));
    guardar();
    renderCarrito();
    mostrarAviso(`${producto.nombre} agregado al carrito`);
  }

  function renderProductos() {
    const grilla = $("productGrid");
    grilla.replaceChildren();
    $("productCounter").textContent = `${productos.length} producto${productos.length === 1 ? "" : "s"}`;
    for (const p of productos) {
      const tarjeta = texto("article", "product-card");
      const imagenCont = texto("div", "product-image-wrap");
      const badge = texto("span", "product-badge", p.badge || "Nuevo");
      const imagen = texto("img", "product-image");
      imagen.src = p.imagen || "img/sin-imagen.svg";
      imagen.alt = `Imagen de ${p.nombre}`;
      imagen.loading = "lazy";
      imagen.addEventListener("error", () => {
        if (!imagen.src.endsWith("sin-imagen.svg")) imagen.src = "img/sin-imagen.svg";
      });
      imagenCont.append(badge, imagen);
      const cuerpo = texto("div", "product-body");
      cuerpo.append(texto("h3", "product-name", p.nombre));
      cuerpo.append(texto("p", "product-description", p.descripcion || ""));
      cuerpo.append(texto("div", "product-price", dinero(p.precio)));
      const acciones = texto("div", "product-actions");
      const cantidadWrap = texto("label", "quantity-field");
      const campo = document.createElement("input");
      campo.type = "number";
      campo.min = "1";
      campo.max = String(MAX_QTY);
      campo.step = "1";
      campo.value = "1";
      campo.inputMode = "numeric";
      campo.setAttribute("aria-label", `Cantidad de ${p.nombre}`);
      cantidadWrap.append(campo);
      const boton = texto("button", "button button-primary add-button", "Agregar +");
      boton.type = "button";
      boton.setAttribute("aria-label", `Agregar ${p.nombre} al carrito`);
      boton.addEventListener("click", () => {
        const qty = cantidadValida(campo.value);
        campo.value = String(qty);
        agregar(p.id, qty);
      });
      acciones.append(cantidadWrap, boton);
      cuerpo.append(acciones);
      tarjeta.append(imagenCont, cuerpo);
      grilla.append(tarjeta);
    }
    if (!productos.length) grilla.append(texto("p", "", "Todavía no hay productos cargados."));
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
    $("mobileCartShortcut").hidden = count === 0;
    $("cartFooter").hidden = count === 0;
    $("cartTotal").textContent = monto;

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
    $("paymentPanel").hidden = !paymentVisible || !count;
    $("payButton").setAttribute("aria-expanded", String(paymentVisible));
    if (paymentVisible && count) renderPago();
  }

  function renderPago() {
    const alias = String(negocio.aliasTransferencia || "").trim();
    const aliasConfigurado = Boolean(alias && alias !== "TU_ALIAS_AQUI");
    $("transferAlias").textContent = alias || "TU_ALIAS_AQUI";
    $("copyAliasButton").disabled = !aliasConfigurado;
    $("aliasWarning").hidden = aliasConfigurado;
    $("paymentTotal").textContent = dinero(total());
    const resumen = $("paymentItems");
    resumen.replaceChildren();
    const lineas = [];
    for (const [id, qty] of Object.entries(cart)) {
      const p = porId.get(id);
      if (!p || qty < 1) continue;
      const li = document.createElement("li");
      li.append(texto("span", "", `${qty} × ${p.nombre}`), texto("span", "", dinero(p.precio * qty)));
      resumen.append(li);
      lineas.push(`• ${qty} × ${p.nombre}: ${dinero(p.precio * qty)}`);
    }
    const telefono = String(negocio.whatsapp || "").replace(/\D/g, "");
    const whatsappConfigurado = /^\d{10,15}$/.test(telefono);
    const mensaje = [
      `¡Hola! Quiero confirmar este pedido de ${negocio.nombre}:`,
      "",
      ...lineas,
      "",
      `TOTAL: ${dinero(total())}`,
      "",
      "Realicé la transferencia. Adjunto el comprobante de pago en este chat para que puedan verificarlo y coordinar la entrega. ¡Gracias!"
    ].join("\n");
    const link = $("whatsappButton");
    link.href = whatsappConfigurado && aliasConfigurado
      ? `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`
      : "#carrito";
    link.setAttribute("aria-disabled", String(!(whatsappConfigurado && aliasConfigurado)));
    link.tabIndex = whatsappConfigurado && aliasConfigurado ? 0 : -1;
    $("whatsappWarning").hidden = whatsappConfigurado && aliasConfigurado;
    $("whatsappWarning").textContent = !aliasConfigurado
      ? "Configurá el alias real en config.js antes de recibir pedidos."
      : "Configurá tu número de WhatsApp en config.js para habilitar este botón.";
  }

  function configurarNegocio() {
    const nombre = negocio.nombre || "Tu tienda";
    $("brandName").textContent = nombre;
    $("footerName").textContent = nombre;
    document.title = `${nombre} | Catálogo y carrito`;
    if (negocio.lema) $("storeTagline").textContent = negocio.lema + ". Elegí, agregá al carrito y coordiná tu compra.";
    $("payButton").addEventListener("click", () => {
      paymentVisible = !paymentVisible;
      renderCarrito();
      if (paymentVisible) $("paymentPanel").scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
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

  configurarNegocio();
  renderProductos();
  renderCarrito();
})();
