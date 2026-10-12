/* ==============================================================
   CONFIGURACIÓN DE TU TIENDA — EDITÁ SOLAMENTE ESTE ARCHIVO.
   Todas las cantidades y precios están en guaraníes por defecto.
   IMPORTANTE: reemplazá el alias y el WhatsApp ANTES de publicar.
   ============================================================== */

window.TIENDA_CONFIG = {
  negocio: {
    nombre: "Mikaris Store",
    lema: "Ropa, belleza, accesorios y bazar para bebés y niños",
    moneda: "PYG",
    idioma: "es-PY",
    aliasTransferencia: "5107171 - CI - Karina Caniza",
    whatsapp: "+595 974 587992",
    costosEntrega: {
      retiro: 0,
      local: null,
      interiorNsa: null,
      interiorTsi: null
    }
  },

  productos: [
    {
      id: "body-bebe",
      nombre: "Body para bebé",
      descripcion: "Ropa suave y cómoda para cada día, con look tiernito y práctico.",
      precio: 65000,
      imagen: "img/body.svg",
      badge: "Top",
      categoria: ["bebes", "ropa"],
      destacado: true
    },
    {
      id: "vestido-nina",
      nombre: "Vestido de niña",
      descripcion: "Conjunto ideal para salir, festejar o lucir con estilo en verano.",
      precio: 98000,
      imagen: "img/dress.svg",
      badge: "Nuevo",
      categoria: ["ninos", "ropa"],
      destacado: true,
      novedad: true
    },
    {
      id: "pijama-nino",
      nombre: "Pijama de niño",
      descripcion: "Tejido suave y acolchado para noches cómodas y relajadas.",
      precio: 89000,
      imagen: "img/pijama.svg",
      badge: "Popular",
      categoria: ["ninos", "ropa"],
      destacado: true
    },
    {
      id: "manta-bebe",
      nombre: "Manta para bebé",
      descripcion: "Abrigada y práctica para momentos de calma, sueño y conexión.",
      precio: 76000,
      imagen: "img/blanket.svg",
      badge: "Bebé",
      categoria: ["bebes", "hogar"]
    },
    {
      id: "perfume-tierno",
      nombre: "Perfumes y fragancias",
      descripcion: "Aromas dulces, modernos y muy bonitos para regalar o usar diario.",
      precio: 120000,
      imagen: "img/plush.svg",
      badge: "Promo",
      categoria: ["belleza"],
      destacado: true
    },
    {
      id: "muñeco-felpa",
      nombre: "Muñeco de felpa",
      descripcion: "Adorable para decorar, regalar o darle un toque más tierno al cuarto.",
      precio: 55000,
      imagen: "img/plush.svg",
      badge: "Regalo",
      categoria: ["accesorios"]
    },
    {
      id: "accesorio-bazar",
      nombre: "Accesorios de bazar",
      descripcion: "Detalles bonitos y útiles para el día a día en casa y para regalar.",
      precio: 32000,
      imagen: "img/taza.svg",
      badge: "Bazar",
      categoria: ["bazar", "hogar"]
    },
    {
      id: "set-bebe",
      nombre: "Set de bebé y bazar",
      descripcion: "Artículos funcionales, tiernos y decorativos para bebés y hogar.",
      precio: 43000,
      imagen: "img/body.svg",
      badge: "Combo",
      categoria: ["bebes", "bazar", "hogar"]
    }
  ]
};
