/* ==============================================================
   CONFIGURACIÓN DE TU TIENDA — EDITÁ SOLAMENTE ESTE ARCHIVO.
   Todas las cantidades y precios están en guaraníes por defecto.
   IMPORTANTE: reemplazá el alias y el WhatsApp ANTES de publicar.
   ============================================================== */

const producto = (id, nombre, talle, precio, imagen, categoria, stock) => ({
  id,
  nombre,
  descripcion: talle ? `Talle: ${talle}.` : "",
  precio,
  imagen: `img/productos/${imagen}`,
  categoria,
  ...(stock === null ? {} : { stock })
});

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
    producto("CH114", "Vincha multicolor RN", "Desde RN", 10000, "image11.jpg", ["bebes", "ropa"], 62),
    producto("CH115", "Media bombacha algodon", "1 a 2 años", 39500, "image2.jpg", ["bebes", "ropa"], 5),
    producto("CH116", "Media bombacha moño", "1 a 2 años", 40000, "image17.jpg", ["bebes", "ropa"], 6),
    producto("CH117", "Vestido blanco cereza", "12 a 18 meses", 135000, "image1.jpg", ["bebes", "ropa"], 2),
    producto("CH118", "Vestido rojo cereza", "12 a 18 meses", 135000, "image32.jpg", ["bebes", "ropa"], 1),
    producto("CH119", "Cortador de bandas", "ninguno", null, "image20.jpg", ["bebes", "ropa"], 4),
    producto("CH120", "Vestido de mariposa", "18 a 24 meses", 130000, "image19.png", ["bebes", "ropa"], 1),
    producto("CH121", "Vestido con alas de mariposa", "2 a 3 años", null, "image4.jpg", ["bebes", "ropa"], 1),
    producto("CH122", "Body mangas largas unitario", "6 a 9 / 9 a 12 / 12 meses", 23500, "image10.jpg", ["bebes", "ropa"], 35),
    producto("CH123", "Body mangas largas set de 5 unidades", "6 a 9 / 9 a 12 / 12 meses", 118000, "image10.jpg", ["bebes", "ropa"], 7),
    producto("CH124", "Conjunto Morley blanco", "18-24", null, "image36.png", ["bebes", "ropa"], 1),
    producto("CH125", "Vestido mariposa fucsia", "12-18 / 18-24", null, "image40.png", ["bebes", "ropa"], 2),
    producto("CH126", "Vestido mariposa verde", "", null, "image64.png", ["bebes", "ropa"], 1),
    producto("CH127", "Vestido mariposa lila", "12-18", null, "image22.png", ["bebes", "ropa"], 1),

    producto("CH100", "Vestibody rosa", "12-18 meses", null, "image45.png", ["ninos", "ropa"], null),
    producto("CH101", "Vestido Margarita", "3-6 meses", null, "image46.png", ["ninos", "ropa"], null),
    producto("CH102", "Vestibody abejita", "9-12 meses", null, "image62.png", ["ninos", "ropa"], null),
    producto("CH103", "Vestido negro polo", "6-9 / 9-12 / 12-18 / 18-24 / 2-3y", null, "image58.png", ["ninos", "ropa"], null),
    producto("CH104", "Vestido celeste 🦆", "6-9 meses", null, "image31.png", ["ninos", "ropa"], null),
    producto("CH105", "Vestido engomado 🦋", "12-18 meses", null, "image34.png", ["ninos", "ropa"], null),
    producto("CH106", "Vestido celeste tul floral", "2-3 años", null, "image33.png", ["ninos", "ropa"], null),
    producto("CH107", "Vestido Fucsia morley", "3-6 meses | 2-3 años", null, "image41.png", ["ninos", "ropa"], null),
    producto("CH108", "Vestido Azul morley", "2-3 años", null, "image61.png", ["ninos", "ropa"], null),
    producto("CH109", "Vaquita", "9-12 meses", null, "image43.png", ["ninos", "ropa"], null),
    producto("CH110", "Vestido tricolor polo", "12-18 meses", null, "image28.png", ["ninos", "ropa"], null),
    producto("CH111", "Vestido blanco polo", "12-18 meses", null, "image52.png", ["ninos", "ropa"], null),
    producto("CH112", "Vestido celeste polo", "2-3 años", null, "image37.png", ["ninos", "ropa"], null),
    producto("CH113", "Vestido Margarita con moño", "12-18 meses", null, "image46.png", ["ninos", "ropa"], null),

    producto("CH128", "Aro corazon hipo", "", null, "image67.jpg", ["accesorios"], null),
    producto("CH129", "Aro argolla dora 18K", "", null, "image93.jpg", ["accesorios"], null),
    producto("CH130", "Cadena plana", "", null, "image85.jpg", ["accesorios"], null),
    producto("CH131", "Set argolla plata/dorado", "", null, "image50.jpg", ["accesorios"], null),
    producto("CH132", "Argolla fina dorado", "", null, "image44.jpg", ["accesorios"], null),
    producto("CH133", "Pulsera/tobillera dorado", "", null, "image69.jpg", ["accesorios"], null),
    producto("CH134", "Pulsera/tobillera plata", "", null, "image54.jpg", ["accesorios"], null),
    producto("CH135", "Tobillera estrella dorado", "", null, "image51.jpg", ["accesorios"], null),
    producto("CH136", "Anillo snake", "", null, "image49.jpg", ["accesorios"], null),
    producto("CH137", "Dijes de sol", "", null, "image48.jpg", ["accesorios"], null),
    producto("CH138", "Anillo de sol", "", null, "image47.jpg", ["accesorios"], null),
    producto("CH139", "Aro de sol", "", null, "image65.jpg", ["accesorios"], null),
    producto("CH140", "Cadena con pelotitas doradas", "", null, "image68.jpg", ["accesorios"], null),
    producto("CH141", "Cadena plana dorado", "", null, "image55.jpg", ["accesorios"], null),
    producto("CH142", "Aretes de flor dorado", "", null, "image95.jpg", ["accesorios"], null),
    producto("CH143", "Media fina con brillos", "", null, "image63.jpg", ["accesorios"], null),
    producto("CH144", "Acces. para la pierna", "", null, "image66.jpg", ["accesorios"], null),
    producto("CH145", "Aro colgante fino", "", null, "image71.jpg", ["accesorios"], null),
    producto("CH146", "Aro colgante/piedras dor", "", null, "image76.jpg", ["accesorios"], null),
    producto("CH147", "Aro colgate/piedras plate", "", null, "image74.jpg", ["accesorios"], null),
    producto("CH148", "Aro colgante tira fina dor", "", null, "image60.jpg", ["accesorios"], null),
    producto("CH149", "Aro flor de cerezo", "", null, "image59.jpg", ["accesorios"], null),
    producto("CH150", "Aro argolla redondo", "", null, "image79.jpg", ["accesorios"], null),
    producto("CH151", "Aro argolla corazon blanco", "", null, "image57.jpg", ["accesorios"], null),
    producto("CH152", "Aro 4mm piedra blanca", "", null, "image96.jpg", ["accesorios"], null),
    producto("CH153", "Tobillera dorado", "", null, "image73.jpg", ["accesorios"], null),
    producto("CH154", "Pulsera de corazon dorado", "", null, "image86.jpg", ["accesorios"], null),
    producto("CH155", "Set 3 piezas aro dorado", "", null, "image72.jpg", ["accesorios"], null),
    producto("CH156", "Perla colgante", "", null, "image92.png", ["accesorios"], null),
    producto("CH157", "Flor negra", "", null, "image75.png", ["accesorios"], null),
    producto("CH158", "Aro largo", "", null, "image70.png", ["accesorios"], null),
    producto("CH159", "Perlas blancas", "", null, "image77.png", ["accesorios"], null),
    producto("CH160", "Pinza de pelo", "", null, "image90.png", ["accesorios"], null),
    producto("CH161", "Hebillita", "", null, "image91.png", ["accesorios"], null),
    producto("CH162", "Piercing", "", null, "image82.png", ["accesorios"], null),
    producto("CH163", "Mini Argollas", "", null, "image88.png", ["accesorios"], null),
    producto("CH164", "Aro con piedra marmolada", "", null, "image84.png", ["accesorios"], null),
    producto("CH165", "Aro rapunzel", "", null, "image87.png", ["accesorios"], null),
    producto("CH166", "Aro colgante", "", null, "image78.png", ["accesorios"], null),
    producto("CH167", "Aro bebe blanco", "", null, "image81.png", ["accesorios"], null),
    producto("CH168", "Aro bebe rosa", "", null, "image83.png", ["accesorios"], null),
    producto("CH169", "Tiara de perlas", "", null, "image94.png", ["accesorios"], null),
    producto("CH170", "Dije de signos zodiacales", "", null, "image89.png", ["accesorios"], null),
    producto("CH207", "Lip Gloss Rhode", "", null, "image100.jpg", ["belleza"], null),
    producto("CH208", "Lip Gloss Rhode", "", null, "image103.jpg", ["belleza"], null),
    producto("CH209", "Cadena plana", "", null, "image109.jpg", ["accesorios"], null),
    producto("CH210", "Nivea", "", null, "image98.jpg", ["belleza"], null)
  ]
};
