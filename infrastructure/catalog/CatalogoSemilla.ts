import { ProductoDigital } from '@/domain/catalog/ProductoDigital';
import { ProductoFisico } from '@/domain/catalog/ProductoFisico';
import { Product } from '@/domain/catalog/Producto';
import { Dinero } from '@/domain/shared/Dinero';
import { ProductId } from '@/domain/shared/ProductId';
import { ProductCollection, TipoProducto } from '@/domain/shared/enums';

/**
 * Catálogo semilla de ShenzhenStock.
 *
 * Antes estos datos vivían duplicados en seis archivos de página
 * (`home-iphone`, `home-ipad`, `home-drone`, `home-juguetes`,
 * `productos-top`, `productos-nuevos`) más una tabla de 19 filas en el
 * repositorio del panel, con precios contradictorios para el mismo
 * producto. Además, `InMemoryProductRepository` solo conocía 3
 * identificadores, así que el 90% de las páginas de detalle caía en un
 * producto genérico con precio y stock equivocados.
 *
 * Ahora hay una sola lista. Las páginas filtran por `coleccion`,
 * `listado` o `categoria` en vez de mantener su propio array.
 *
 * El peso en gramos vive solo en los productos físicos; es lo único que
 * `ProductoFisico` necesita para cumplir el contrato de envío.
 */
interface SeedProduct {
  readonly id: string;
  readonly nombre: string;
  readonly descripcion: string;
  readonly categoria: string;
  readonly precio: number;
  readonly stock: number;
  readonly imagen: string;
  readonly coleccion: ProductCollection;
  readonly pesoGramos?: number;
  readonly destacado?: boolean;
  readonly novedad?: boolean;
  readonly tendencia?: boolean;
}

const SEMILLA: ReadonlyArray<SeedProduct> = [
  // ---------------------------------------------------------------- iPhone
  {
    id: 'funda-iphone-17',
    nombre: 'Funda iPhone 17 Pro Max',
    descripcion: 'Funda Premium con tecnología MagSafe y bordes reforzados anti-impacto.',
    categoria: 'iPhone 17',
    precio: 25000,
    stock: 10,
    imagen: '/FUNDA-IPHONE-17.jpg',
    coleccion: ProductCollection.Iphone,
    pesoGramos: 55,
    destacado: true,
    tendencia: true,
  },
  {
    id: 'funda-iphone-14-roja',
    nombre: 'Funda iPhone 14 Roja MagSafe',
    descripcion: 'Silicona líquida de primera calidad con absorción de impactos y alineación magnética.',
    categoria: 'iPhone 14',
    precio: 20000,
    stock: 30,
    imagen: '/FUNDA-IPHONE-14-ROJA.jpg',
    coleccion: ProductCollection.Iphone,
    pesoGramos: 45,
    destacado: true,
  },
  {
    id: 'funda-iphone-14-transparente',
    nombre: 'Funda iPhone 14 Transparente',
    descripcion: 'Case cristalino de alta resistencia con tratamiento anti-amarillamiento.',
    categoria: 'iPhone 14',
    precio: 19000,
    stock: 25,
    imagen: '/FUNDA-IPHONE-14-TRANSPARENTE.jpg',
    coleccion: ProductCollection.Iphone,
    pesoGramos: 40,
  },
  {
    id: 'cargador-iphone',
    nombre: 'Adaptador de Corriente USB-C de 20W',
    descripcion: 'Carga ultrarrápida que lleva tu iPhone del 0 al 50% en solo 30 minutos.',
    categoria: 'Energía',
    precio: 45000,
    stock: 120,
    imagen: '/CARGADOR-IPHONE.jpg',
    coleccion: ProductCollection.Iphone,
    pesoGramos: 95,
    destacado: true,
  },
  {
    id: 'funda-iphone-14-normal',
    nombre: 'Funda iPhone 14 Black',
    descripcion: 'Funda Premium mate con agarre antideslizante y acabado antichapuz.',
    categoria: 'iPhone 14',
    precio: 20000,
    stock: 28,
    imagen: '/FUNDA-IPHONE-14.jpg',
    coleccion: ProductCollection.Iphone,
    pesoGramos: 45,
  },
  {
    id: 'funda-iphone-16-rosada',
    nombre: 'Funda iPhone 16 Rosada',
    descripcion: 'Funda Premium con tecnología MagSafe, edición pastel de la temporada.',
    categoria: 'iPhone 16',
    precio: 21000,
    stock: 22,
    imagen: '/FUNDA-IPHONE-16-ROSA.jpg',
    coleccion: ProductCollection.Iphone,
    pesoGramos: 48,
  },

  // ------------------------------------------------------------------ iPad
  {
    id: 'funda-ipad-pro',
    nombre: 'Funda iPad Pro',
    descripcion: 'Funda Premium con tecnología MagSafe y soporte magnético para Apple Pencil.',
    categoria: 'Accesorios iPad',
    precio: 30000,
    stock: 16,
    imagen: '/FUNDA-IPAD-PRO.jpg',
    coleccion: ProductCollection.Ipad,
    pesoGramos: 210,
    destacado: true,
  },
  {
    id: 'funda-ipad-pro-smart-folio',
    nombre: 'Funda iPad Pro Smart Folio',
    descripcion: 'Funda Premium con soporte magnético y cierre magnético de apertura automática.',
    categoria: 'iPad Pro',
    precio: 25000,
    stock: 12,
    imagen: '/FUNDA-IPAD-PRO.jpg',
    coleccion: ProductCollection.Ipad,
    pesoGramos: 205,
  },
  {
    id: 'funda-ipad-pro-negra',
    nombre: 'Funda iPad Pro Black Edition',
    descripcion: 'Protección integral ultra delgada con cubierta inteligente de Stand incluida.',
    categoria: 'iPad Pro',
    precio: 27000,
    stock: 14,
    imagen: '/FUNDA-IPAD-1.jpg',
    coleccion: ProductCollection.Ipad,
    pesoGramos: 215,
  },
  {
    id: 'funda-ipad-pro-armor',
    nombre: 'Funda iPad Pro Armor V2',
    descripcion: 'Funda de alto impacto con espacio dedicado para el Apple Pencil.',
    categoria: 'iPad Pro',
    precio: 25000,
    stock: 9,
    imagen: '/FUNDA-IPAD-2.jpg',
    coleccion: ProductCollection.Ipad,
    pesoGramos: 230,
  },
  {
    id: 'cargador-ipad-pro',
    nombre: 'Cargador iPad Pro 30W',
    descripcion: 'Adaptador USB-C de alta potencia para carga ultrarrápida del iPad Pro.',
    categoria: 'Energía',
    precio: 30000,
    stock: 40,
    imagen: '/CARGADOR-IPAD-PRO.jpg',
    coleccion: ProductCollection.Ipad,
    pesoGramos: 110,
  },
  {
    id: 'funda-ipad-pro-executive',
    nombre: 'Funda iPad Pro Executive V3',
    descripcion: 'Funda estilo cuero sintético con ajuste multiposición y cierre de presión.',
    categoria: 'iPad Pro',
    precio: 85000,
    stock: 2,
    imagen: '/FUNDA-IPAD-3.jpg',
    coleccion: ProductCollection.Ipad,
    pesoGramos: 280,
  },

  // ----------------------------------------------------------------- Drone
  {
    id: 'drone-1',
    nombre: 'Drone ALPHA 4K Pro',
    descripcion: 'Drone profesional con cámara 4K Ultra HD y estabilización gimbal de 3 ejes.',
    categoria: 'Drones 4K',
    precio: 105000,
    stock: 1,
    imagen: '/DRONE-1.jpg',
    coleccion: ProductCollection.Drone,
    pesoGramos: 950,
    tendencia: true,
  },
  {
    id: 'drone-2',
    nombre: 'Drone ALPHA 2K Auto-Return',
    descripcion: 'Drone de alta precisión con GPS y función de retorno automático.',
    categoria: 'Drones 2K',
    precio: 89000,
    stock: 1,
    imagen: '/DRONE-2.jpg',
    coleccion: ProductCollection.Drone,
    pesoGramos: 880,
    tendencia: true,
  },
  {
    id: 'control-drone',
    nombre: 'Controlador de Drone Pro',
    descripcion: 'Controlador ergonómico con soporte para smartphone y transmisión HD a 2.4GHz.',
    categoria: 'Periféricos',
    precio: 45000,
    stock: 2,
    imagen: '/CONTROL-DRONE.jpg',
    coleccion: ProductCollection.Drone,
    pesoGramos: 320,
  },

  // -------------------------------------------------------------- Juguetes
  {
    id: 'lego',
    nombre: 'Set de Ladrillos LEGO CITY',
    descripcion: 'Set de ladrillos para construir tu propio universo de diversión y creatividad.',
    categoria: 'Juguetes',
    precio: 43000,
    stock: 8,
    imagen: '/LEGO.jpg',
    coleccion: ProductCollection.Juguetes,
    pesoGramos: 850,
  },
  {
    id: 'dinosaurio',
    nombre: 'Dinosaurio de peluche',
    descripcion: 'Un adorable dinosaurio de peluche para que tus hijos lo tengan siempre cerca.',
    categoria: 'Juguetes',
    precio: 15000,
    stock: 24,
    imagen: '/dinosaurio.jpg',
    coleccion: ProductCollection.Juguetes,
    pesoGramos: 260,
  },

  // ------------------------------------------------------ Destacados (TOP)
  {
    id: 'airpods',
    nombre: 'AirPods Pro 2',
    descripcion: 'Audífonos inalámbricos con cancelación activa de ruido y audio espacial.',
    categoria: 'Audio',
    precio: 105000,
    stock: 18,
    imagen: '/AIRPODS.jpg',
    coleccion: ProductCollection.Iphone,
    pesoGramos: 60,
    destacado: true,
    tendencia: true,
  },
  {
    id: 'binoculares',
    nombre: 'Binoculares 10x42',
    descripcion: 'Binoculares de alta definición con lentes multicapa para observación detallada.',
    categoria: 'Óptica',
    precio: 55000,
    stock: 11,
    imagen: '/BINOCULARES.jpg',
    coleccion: ProductCollection.Drone,
    pesoGramos: 640,
    destacado: true,
  },
  {
    id: 'camara-gopro',
    nombre: 'Cámara GoPro Hero 11',
    descripcion: 'Cámara de acción de alta gama para aventuras y deportes extremos.',
    categoria: 'Video & Acción',
    precio: 180000,
    stock: 4,
    imagen: '/CAMARA-GO-PRO.jpg',
    coleccion: ProductCollection.Iphone,
    pesoGramos: 153,
    destacado: true,
  },
  {
    id: 'diadema-gamer-1',
    nombre: 'Diadema Gamer Pro 1',
    descripcion: 'Headset gamer con micrófono aislante y sonido envolvente 7.1.',
    categoria: 'Gaming',
    precio: 40000,
    stock: 15,
    imagen: '/DIADEMA-GAMER-1.jpg',
    coleccion: ProductCollection.Juguetes,
    pesoGramos: 320,
    destacado: true,
  },
  {
    id: 'herramienta-celular',
    nombre: 'Herramienta de Precisión',
    descripcion: 'Herramienta multifuncional para reparación de microelectrónica.',
    categoria: 'Herramientas',
    precio: 32000,
    stock: 26,
    imagen: '/HERRAMIENTA-CELULAR.jpg',
    coleccion: ProductCollection.Iphone,
    pesoGramos: 180,
    destacado: true,
  },
  {
    id: 'diadema-gamer-2',
    nombre: 'Diadema Gamer Pro 2',
    descripcion: 'Diadema de juego con iluminación RGB y audio inmersivo.',
    categoria: 'Gaming',
    precio: 45000,
    stock: 13,
    imagen: '/DIADEMA-GAMER-2.jpg',
    coleccion: ProductCollection.Juguetes,
    pesoGramos: 340,
    destacado: true,
    tendencia: true,
  },
  {
    id: 'intercomunicador-1',
    nombre: 'Intercomunicador R1',
    descripcion: 'Intercomunicador Bluetooth de alta calidad para casco de moto.',
    categoria: 'Comunicación',
    precio: 45000,
    stock: 9,
    imagen: '/INTERCOMUNICADOR-1.jpg',
    coleccion: ProductCollection.Drone,
    pesoGramos: 210,
    destacado: true,
  },
  {
    id: 'kit-herramientas',
    nombre: 'Kit de Herramientas Master',
    descripcion: 'Set completo de precisión para desarme y reparación de dispositivos.',
    categoria: 'Herramientas',
    precio: 70000,
    stock: 6,
    imagen: '/KIT-HERRAMIENTA.jpg',
    coleccion: ProductCollection.Iphone,
    pesoGramos: 480,
    destacado: true,
  },
  {
    id: 'intercomunicador-2',
    nombre: 'Intercomunicador R2 Pro',
    descripcion: 'Intercomunicador con cancelación de ruido de viento y música.',
    categoria: 'Comunicación',
    precio: 55000,
    stock: 7,
    imagen: '/INTERCOMUNICADOR-2.jpg',
    coleccion: ProductCollection.Drone,
    pesoGramos: 225,
    destacado: true,
  },
  {
    id: 'mouse-gamer',
    nombre: 'Mouse Gamer Ultra',
    descripcion: 'Mouse ergonómico con sensor óptico de alta precisión y RGB.',
    categoria: 'Gaming',
    precio: 32000,
    stock: 21,
    imagen: '/MAUSE.jpg',
    coleccion: ProductCollection.Juguetes,
    pesoGramos: 140,
    destacado: true,
  },
  {
    id: 'teclado-gamer',
    nombre: 'Teclado Mecánico Gamer',
    descripcion: 'Teclado mecánico con switches de rápida respuesta e iluminación RGB.',
    categoria: 'Gaming',
    precio: 65000,
    stock: 10,
    imagen: '/TECLADO.jpg',
    coleccion: ProductCollection.Juguetes,
    pesoGramos: 980,
    destacado: true,
  },
  {
    id: 'trimmer',
    nombre: 'Trimmer Eléctrico Pro',
    descripcion: 'Corta pelo y patillero de alta potencia para corte preciso.',
    categoria: 'Cuidado Personal',
    precio: 67000,
    stock: 12,
    imagen: '/TRIMMER.jpg',
    coleccion: ProductCollection.Iphone,
    pesoGramos: 360,
    destacado: true,
  },

  // ------------------------------------------------------------- Novedades
  {
    id: 'bateria-portatil-20000mah',
    nombre: 'Batería Portátil 20000mAh',
    descripcion: 'Carga rápida y eficiente para mantener tu dispositivo energizado en todo momento.',
    categoria: 'Energía',
    precio: 45000,
    stock: 17,
    imagen: '/BATERIA-SOLAR.jpg',
    coleccion: ProductCollection.Iphone,
    pesoGramos: 420,
    novedad: true,
    tendencia: true,
  },
  {
    id: 'extensor-enchufe-inteligente',
    nombre: 'Extensor de Enchufe Inteligente',
    descripcion: 'Controla tu hogar desde cualquier lugar con este extensor inteligente.',
    categoria: 'Hogar Inteligente',
    precio: 22000,
    stock: 19,
    imagen: '/EXTENSOR-ENCHUFE-PARED.jpg',
    coleccion: ProductCollection.Iphone,
    pesoGramos: 260,
    novedad: true,
  },
  {
    id: 'gafas-realidad-virtual',
    nombre: 'Gafas de Realidad Virtual 3D',
    descripcion: 'Inmersión total en entornos virtuales con alta resolución y latencia baja.',
    categoria: 'Video & Acción',
    precio: 35000,
    stock: 8,
    imagen: '/GAFAS-VR.jpg',
    coleccion: ProductCollection.Iphone,
    pesoGramos: 380,
    novedad: true,
  },
  {
    id: 'inflador-portatil-12v',
    nombre: 'Inflador Portátil 12V',
    descripcion: 'Infla rápidamente los neumáticos de tu vehículo con este inflador portátil.',
    categoria: 'Automotriz',
    precio: 30000,
    stock: 14,
    imagen: '/INFLADOR-PSI.jpg',
    coleccion: ProductCollection.Iphone,
    pesoGramos: 1100,
    novedad: true,
  },
  {
    id: 'tripode-para-celular',
    nombre: 'Trípode para Celular',
    descripcion: 'Estabiliza tu cámara y toma fotos perfectas con este trípode ajustable.',
    categoria: 'Fotografía',
    precio: 25000,
    stock: 23,
    imagen: '/TRIPODE.jpg',
    coleccion: ProductCollection.Iphone,
    pesoGramos: 290,
    novedad: true,
  },
  {
    id: 'soporte-digital-premium',
    nombre: 'Soporte Digital Premium 24/7',
    descripcion:
      'Plan de soporte remoto 24/7 con línea directa a especialistas y sin nada que enviar. Producto digital de activación inmediata.',
    categoria: 'Servicios Digitales',
    precio: 45000,
    stock: 999,
    imagen: '/globe.svg',
    coleccion: ProductCollection.Iphone,
    novedad: true,
  },
];

/**
 * Construye la entidad correcta según si el producto tiene peso declarado.
 * Los productos sin peso son digitales: no se envían, no paga envío.
 */
function construir(datos: SeedProduct): Product {
  const comun = {
    id: new ProductId(datos.id),
    nombre: datos.nombre,
    descripcion: datos.descripcion,
    categoria: datos.categoria,
    precio: Dinero.de(datos.precio),
    stock: datos.stock,
    imagen: datos.imagen,
    tipo: datos.pesoGramos === undefined ? TipoProducto.Digital : TipoProducto.Fisico,
    coleccion: datos.coleccion,
    destacado: datos.destacado ?? false,
    novedad: datos.novedad ?? false,
    tendencia: datos.tendencia ?? false,
  };
  return datos.pesoGramos === undefined
    ? new ProductoDigital(comun)
    : new ProductoFisico({ ...comun, pesoGramos: datos.pesoGramos });
}

/**
 * Instancias únicas y compartidas. Que el catálogo se construya una sola
 * vez es lo que garantiza la identidad: dos referencias al mismo producto
 * son el **mismo** objeto, no dos copias (antes, `load()` creaba 19
 * productos nuevos en cada llamada y `p1 === p2` daba `false`).
 */
export const CATALOGO_SEMILLA: ReadonlyArray<Product> = Object.freeze(
  SEMILLA.map(construir),
);

const POR_ID: ReadonlyMap<string, Product> = new Map(
  CATALOGO_SEMILLA.map((producto) => [producto.id.valor, producto]),
);

/**
 * Resuelve un producto de la semilla por su identificador.
 *
 * Lanza si no existe, a propósito: los datos de arranque de los pedidos
 * deben apuntar a productos reales, y un `?? null` escondido convertiría
 * ese error de datos en un `undefined` que revienta más lejos y más difícil
 * de diagnosticar.
 */
export function productoSemilla(id: string): Product {
  const producto = POR_ID.get(id);
  if (!producto) {
    throw new Error(`El producto semilla "${id}" no existe en el catálogo.`);
  }
  return producto;
}
