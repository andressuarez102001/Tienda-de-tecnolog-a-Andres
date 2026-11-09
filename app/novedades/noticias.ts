export type CategoriaNoticia = 'Gaming' | 'IA' | 'Hardware' | 'Consolas';

export interface CitaEditorial {
  readonly texto: string;
  readonly autor: string;
}

export interface ImagenNoticia {
  readonly src: string;
  readonly alt: string;
  readonly pie: string;
}

export interface Noticia {
  readonly id: string;
  readonly titulo: string;
  readonly descripcion: string;
  readonly fecha: string;
  readonly fechaISO: string;
  readonly categoria: CategoriaNoticia;
  readonly degradado: string;
  readonly minutosLectura: number;
  readonly imagenes: readonly [ImagenNoticia, ImagenNoticia, ImagenNoticia];
  readonly puntosClave: ReadonlyArray<string>;
  readonly contenido: ReadonlyArray<string>;
  readonly cita: CitaEditorial;
}

/**
 * Contenido editorial de demostración.
 *
 * Vive aparte de la página para que el listado y el detalle compartan la misma
 * fuente, sin tocar catálogo, pedidos ni PostgreSQL.
 */
export const NOTICIAS: ReadonlyArray<Noticia> = [
  {
    id: 'gta-vi-filtraciones',
    titulo: 'GTA VI: las filtraciones que están encendiendo todas las alarmas',
    descripcion:
      'Nuevos mapas, mecánicas de conducción y detalles del modo historia habrían salido a la luz antes de tiempo.',
    fecha: '08 nov 2026',
    fechaISO: '2026-11-08',
    categoria: 'Gaming',
    degradado: 'from-fuchsia-600 via-purple-600 to-indigo-700',
    minutosLectura: 5,
    imagenes: [
      {
        src: '/novedades/gta-vi-filtraciones-1.jpg',
        alt: 'Ilustración conceptual de una ciudad costera iluminada por un sol neón',
        pie: 'El mapa promete regiones urbanas más densas y conectadas.',
      },
      {
        src: '/novedades/gta-vi-filtraciones-2.jpg',
        alt: 'Ilustración conceptual de una carretera con rascacielos al fondo',
        pie: 'La conducción renovada sería uno de los cambios más comentados.',
      },
      {
        src: '/novedades/gta-vi-filtraciones-3.jpg',
        alt: 'Ilustración conceptual de una ciudad con palmeras y luces de neón',
        pie: 'Los rumores apuntan a varios biomas dentro del mismo mundo abierto.',
      },
    ],
    puntosClave: [
      'El mapa sería más denso, con regiones urbanas y rurales conectadas por una red vial continua.',
      'La conducción tendría más peso físico, daños visibles y reacciones distintas según el clima.',
      'Rockstar no ha confirmado los detalles: todo debe leerse como rumor hasta un anuncio oficial.',
    ],
    contenido: [
      'Pocos lanzamientos cargan con tanta expectativa como GTA VI. Después de años de silencio, cada imagen, cada clip de pocos segundos y cada supuesta filtración se convierte en material de análisis para una comunidad que lleva más de una década esperando la continuación de GTA V. La más reciente ola de rumores no es la excepción: habla de un mundo abierto mucho más ambicioso, pero también de un desarrollo que todavía guarda cartas bajo la mesa.',
      'El punto que más atención ha recibido es el mapa. Según los reportes, el juego combinaría varias regiones con identidad propia: centros urbanos saturados de vida, barrios con dinámicas distintas, carreteras interconectadas y amplias zonas naturales. La promesa no sería solo un escenario más grande, sino uno más denso, con interiores explorables, rutinas de personajes más complejas y eventos que cambiarían según la hora y el clima.',
      'La conducción también ocuparía un lugar central. Las filtraciones sugieren un modelo físico renovado, con vehículos que responderían de forma diferente al peso, la velocidad y el terreno. Los daños visibles, la deformación de las carrocerías y una mayor interacción con el entorno podrían convertir cada persecución en una experiencia menos arcade y más impredecible. Para una saga que siempre ha vivido de la sensación de libertad, ese detalle puede ser decisivo.',
      'En el plano narrativo, los rumores apuntan a una estructura de misiones más flexible, con dos protagonistas y un tono que mezclaría humor, tensión y crítica social. La clave estará en cómo Rockstar conecte esa libertad con una historia que no se sienta fragmentada. La compañía ya demostró con Red Dead Redemption 2 que puede construir un mundo enorme sin sacrificar el detalle, aunque también aprendió que la escala por sí sola no garantiza una experiencia redonda.',
      'Conviene mantener la calma. Nada de esto ha sido confirmado de forma oficial y las filtraciones suelen mezclar información real con deseos de la comunidad. Aun así, el interés tiene una explicación clara: GTA VI no solo definirá el futuro de Rockstar, también marcará el listón técnico y narrativo que muchos jugadores esperarán del resto de la industria. Cuando llegue el anuncio definitivo, la conversación no hará más que empezar.',
    ],
    cita: {
      texto:
        'La filtración no confirma el juego; confirma el hambre de una generación que lleva años imaginando cómo será volver a Liberty City, Vice City o algo completamente nuevo.',
      autor: 'Análisis editorial ShenzhenStock',
    },
  },
  {
    id: 'ia-agentes-autonomos',
    titulo: 'La nueva generación de IA ya no responde: ahora actúa por ti',
    descripcion:
      'Los agentes autónomos prometen automatizar tareas complejas y cambiar la forma en que trabajamos con software.',
    fecha: '07 nov 2026',
    fechaISO: '2026-11-07',
    categoria: 'IA',
    degradado: 'from-cyan-500 via-blue-600 to-indigo-700',
    minutosLectura: 6,
    imagenes: [
      {
        src: '/novedades/ia-agentes-autonomos-1.jpg',
        alt: 'Ilustración conceptual de una red de nodos conectados por líneas de luz',
        pie: 'Los agentes combinan memoria, herramientas y planificación.',
      },
      {
        src: '/novedades/ia-agentes-autonomos-2.jpeg',
        alt: 'Ilustración conceptual de un panel de terminal con flujos de datos',
        pie: 'El uso de herramientas externas separa al agente de un chatbot.',
      },
      {
        src: '/novedades/ia-agentes-autonomos-3.jpeg',
        alt: 'Ilustración conceptual de un núcleo de inteligencia artificial rodeado de órbitas',
        pie: 'La supervisión humana sigue siendo el punto de control.',
      },
    ],
    puntosClave: [
      'Los agentes combinan planificación, memoria y uso de herramientas para ejecutar tareas de varios pasos.',
      'Su valor aparece en desarrollo, soporte, análisis y operaciones, no solo en conversaciones.',
      'El gran desafío es de confianza: permisos, trazabilidad y supervisión humana siguen siendo obligatorios.',
    ],
    contenido: [
      'Durante los últimos años nos acostumbramos a hablar con la inteligencia artificial como si fuera un asistente especialmente paciente. Le hacíamos una pregunta, recibíamos una respuesta y volvíamos a empezar. La nueva generación de agentes rompe ese esquema: ya no espera una instrucción por mensaje, sino que recibe un objetivo y decide qué pasos dar para acercarse a él.',
      'La diferencia parece pequeña, pero cambia todo. Un agente puede descomponer una tarea en subtareas, consultar documentos, abrir herramientas externas, revisar resultados y corregir el rumbo cuando algo falla. En desarrollo de software, por ejemplo, es capaz de leer un repositorio, proponer un cambio, ejecutar pruebas y dejar un informe listo para revisión. En atención al cliente, puede consultar el historial de una cuenta antes de responder. En análisis de datos, puede construir consultas, validarlas y explicar sus hallazgos.',
      'Esa autonomía también introduce riesgos nuevos. Un agente con acceso a correo, bases de datos o sistemas de pago puede hacer mucho daño si interpreta mal una instrucción o si alguien manipula el contenido que consume. La seguridad deja de ser un filtro al final del flujo y se convierte en parte del diseño: permisos mínimos, límites de acción, registros completos y puntos de control donde una persona aprueba lo que va a ocurrir.',
      'Las empresas que están probando estos sistemas coinciden en una idea: el mayor retorno no viene de reemplazar personas, sino de eliminar el trabajo repetitivo que rodea a las decisiones importantes. Un agente puede preparar el terreno, reunir evidencia y proponer opciones; el criterio final sigue siendo humano. Esa combinación, bien diseñada, permite que los equipos dediquen más tiempo a pensar y menos a mover información de un lugar a otro.',
      'El futuro inmediato no será una oficina llena de agentes trabajando solos. Será un ecosistema híbrido, con personas y modelos colaborando en tareas acotadas, medibles y auditables. La pregunta ya no es si la IA puede actuar, sino cuánta libertad estamos dispuestos a darle y cómo demostramos que sigue haciendo lo correcto cuando nadie está mirando.',
    ],
    cita: {
      texto:
        'Un asistente te da una respuesta. Un agente te entrega un resultado. La diferencia está en que, para llegar allí, tomó decisiones que alguien tiene que poder explicar.',
      autor: 'Análisis editorial ShenzhenStock',
    },
  },
  {
    id: 'gpu-nueva-generacion',
    titulo: 'Las próximas tarjetas gráficas apuntan a 8K sin concesiones',
    descripcion:
      'Memoria más rápida, arquitecturas renovadas y un salto térmico que podría redefinir el gaming de alto rendimiento.',
    fecha: '06 nov 2026',
    fechaISO: '2026-11-06',
    categoria: 'Hardware',
    degradado: 'from-emerald-500 via-teal-600 to-cyan-700',
    minutosLectura: 6,
    imagenes: [
      {
        src: '/novedades/gpu-nueva-generacion-1.png',
        alt: 'Ilustración conceptual de un chip gráfico con trazas de circuito',
        pie: 'La nueva generación prioriza eficiencia y ancho de banda.',
      },
      {
        src: '/novedades/gpu-nueva-generacion-2.jpg',
        alt: 'Ilustración conceptual de una tarjeta gráfica con ventiladores',
        pie: 'El 8K dependerá del escalado y del trazado de rayos.',
      },
      {
        src: '/novedades/gpu-nueva-generacion-3.jpg',
        alt: 'Ilustración conceptual de un circuito con nodos de datos',
        pie: 'La IA local también empuja la demanda de memoria gráfica.',
      },
    ],
    puntosClave: [
      'La nueva generación prioriza eficiencia por vatio, no solo fuerza bruta.',
      'El 8K sería posible gracias a escalado, trazado de rayos y memoria más rápida.',
      'Precio, consumo y disponibilidad definirán si el salto vale la pena.',
    ],
    contenido: [
      'Cada nueva generación de tarjetas gráficas promete el doble de rendimiento, pero esta vez el discurso parece más interesante. Los fabricantes no solo hablan de más núcleos y más memoria: hablan de eficiencia, de temperaturas controladas y de una arquitectura pensada para cargas que hace cinco años no existían. El 8K vuelve a ser la meta visible, aunque el verdadero cambio ocurre debajo del capó.',
      'La memoria será protagonista. Los nuevos módulos de mayor velocidad y las interfaces más anchas buscan alimentar a los procesadores gráficos sin los cuellos de botella que aparecen en resoluciones extremas. A eso se suman avances en trazado de rayos y escalado por inteligencia artificial, dos tecnologías que permiten construir una imagen de alta calidad sin renderizar cada píxel de forma tradicional.',
      'El impacto en juegos podría notarse menos en los títulos competitivos, que ya funcionan a cientos de fotogramas por segundo, y más en experiencias cinematográficas. Mundos abiertos con iluminación dinámica, reflejos complejos y multitudes densas son el escenario natural para estas tarjetas. La promesa es una imagen más estable, con menos artefactos y una sensación de fluidez que no dependa de bajar la calidad.',
      'Pero el gaming no es el único mercado. La inteligencia artificial local está empujando la demanda de memoria gráfica y de cálculo paralelo. Modelos de imagen, asistentes que corren en la propia máquina y herramientas de edición en tiempo real necesitan exactamente lo que estas GPU están construyendo: mucho ancho de banda y una arquitectura eficiente. Esa doble demanda puede definir el precio y la disponibilidad mucho más que cualquier juego.',
      'La gran incógnita sigue siendo el costo total de la experiencia. Una tarjeta más potente suele exigir una fuente mejor, más ventilación y, en muchos casos, un procesador que no la limite. El salto a 8K solo tiene sentido si el resto del equipo acompaña. Para la mayoría de jugadores, la verdadera pregunta será si conviene dar el paso ahora o esperar a que la nueva generación se asiente y los precios encuentren su punto real.',
    ],
    cita: {
      texto:
        'El 8K es el titular, pero la eficiencia es la historia. Una tarjeta que hace más con menos calor es más valiosa que una que solo sube números en la caja.',
      autor: 'Análisis editorial ShenzhenStock',
    },
  },
  {
    id: 'xbox-ps5-futuro',
    titulo: 'Xbox Series X y PS5 preparan su segunda vida en la nube',
    descripcion:
      'Las consolas tradicionales evolucionan hacia ecosistemas híbridos donde el streaming y el hardware local conviven.',
    fecha: '05 nov 2026',
    fechaISO: '2026-11-05',
    categoria: 'Consolas',
    degradado: 'from-blue-500 via-indigo-600 to-violet-700',
    minutosLectura: 5,
    imagenes: [
      {
        src: '/novedades/xbox-ps5-futuro-1.jpg',
        alt: 'Ilustración conceptual de una consola y una nube conectadas por señales',
        pie: 'El streaming se integra como una extensión del hardware.',
      },
      {
        src: '/novedades/xbox-ps5-futuro-2.jpg',
        alt: 'Ilustración conceptual de un control de videojuegos frente a servidores',
        pie: 'La latencia sigue siendo el gran reto de la nube.',
      },
      {
        src: '/novedades/xbox-ps5-futuro-3.jpg',
        alt: 'Ilustración conceptual de pantallas y dispositivos compartiendo una partida',
        pie: 'La biblioteca busca acompañar al jugador en cualquier pantalla.',
      },
    ],
    puntosClave: [
      'Las consolas no desaparecen: se convierten en el centro de un ecosistema híbrido.',
      'El streaming gana terreno para jugar lejos del televisor principal.',
      'Latencia, catálogo y propiedad digital siguen siendo las grandes dudas.',
    ],
    contenido: [
      'Durante años, la conversación sobre el futuro de las consolas estuvo dominada por una pregunta: ¿llegará una nueva generación o el streaming lo cambiará todo? La respuesta que empieza a tomar forma es menos radical y más interesante. Xbox Series X y PS5 no están siendo reemplazadas; están aprendiendo a vivir en varios lugares a la vez.',
      'La nube deja de ser un experimento para convertirse en una extensión del hardware. La idea es sencilla: el juego se ejecuta en un servidor potente y el jugador lo recibe en un televisor, una tablet o un portátil sin necesidad de descargar cientos de gigabytes. Para quien ya tiene la consola, el beneficio es poder continuar una partida en otra pantalla sin mover el equipo ni copiar archivos.',
      'Detrás de esa promesa hay una infraestructura enorme. Centros de datos cerca de los jugadores, redes optimizadas, guardado sincronizado y un catálogo que debe funcionar igual en todas las pantallas. Los fabricantes están invirtiendo en ese ecosistema porque el valor ya no está solo en vender una caja, sino en mantener al jugador dentro de una biblioteca que lo acompaña a donde vaya.',
      'Sin embargo, la experiencia todavía depende de factores que no se resuelven con marketing. La latencia sigue siendo crítica en juegos de acción, la calidad de imagen puede variar con la conexión y la compresión introduce artefactos que los más exigentes notan de inmediato. El hardware local conserva una ventaja clara: hace todo el trabajo en casa y no negocia con la red.',
      'El futuro probable no es “todo en la nube” ni “todo en la consola”, sino una convivencia. La consola se queda como la opción de máxima calidad y menor latencia; el streaming cubre la movilidad y las pantallas secundarias. La pregunta que queda abierta es de propiedad: qué pasa con los juegos comprados, con las licencias y con una biblioteca que depende de servidores que no controlamos. Esa será la discusión que defina la próxima década.',
    ],
    cita: {
      texto:
        'La consola no va a desaparecer. Va a dejar de ser el único lugar donde ocurre el juego.',
      autor: 'Análisis editorial ShenzhenStock',
    },
  },
  {
    id: 'ssd-pcie-6',
    titulo: 'SSD PCIe 6.0: velocidades que parecen salidas del futuro',
    descripcion:
      'La nueva generación de almacenamiento duplica el ancho de banda y promete cargas prácticamente instantáneas.',
    fecha: '04 nov 2026',
    fechaISO: '2026-11-04',
    categoria: 'Hardware',
    degradado: 'from-orange-500 via-amber-500 to-yellow-600',
    minutosLectura: 6,
    imagenes: [
      {
        src: '/novedades/ssd-pcie-6-1.jpg',
        alt: 'Ilustración conceptual de una unidad SSD M.2 con chips de memoria',
        pie: 'PCIe 6.0 duplica el ancho de banda bruto.',
      },
      {
        src: '/novedades/ssd-pcie-6-2.jpg',
        alt: 'Ilustración conceptual de líneas de datos atravesando un circuito',
        pie: 'El rendimiento real depende del conjunto del sistema.',
      },
      {
        src: '/novedades/ssd-pcie-6-3.jpeg',
        alt: 'Ilustración conceptual de un disipador y una unidad de almacenamiento',
        pie: 'Temperatura y consumo serán claves en la nueva generación.',
      },
    ],
    puntosClave: [
      'PCIe 6.0 duplica el ancho de banda bruto frente a PCIe 5.0.',
      'El beneficio real depende de controladoras, software y temperaturas.',
      'La adopción será gradual y empezará por servidores y equipos profesionales.',
    ],
    contenido: [
      'El almacenamiento es una de esas piezas que solo notamos cuando se queda corta. Un SSD lento convierte una máquina potente en una experiencia frustrante. Por eso cada nueva generación de PCIe genera expectativa: promete mover datos a una velocidad que hace unos años parecía imposible. PCIe 6.0 lleva esa promesa al siguiente nivel y duplica el ancho de banda bruto de PCIe 5.0.',
      'El cambio no es solo una cuestión de números. La especificación introduce una señalización más compleja y un formato de paquetes que permite aprovechar mejor el enlace. Para el usuario final, la traducción es simple: más datos viajando al mismo tiempo y menos tiempo de espera en operaciones que dependen del disco, como cargar un juego, abrir un proyecto de video o entrenar un modelo de inteligencia artificial.',
      'En la práctica, sin embargo, el cuello de botella suele estar en otro lugar. Una unidad PCIe 6.0 conectada a un sistema que no puede alimentarla correctamente no mostrará todo su potencial. Controladoras, memoria caché, disipación y el propio software deben estar a la altura. En juegos, además, muchos tiempos de carga dependen más de la organización de los datos que del ancho de banda puro.',
      'El calor será un desafío importante. A mayor velocidad, mayor consumo y más necesidad de refrigeración. Los SSD de alto rendimiento ya necesitan disipadores voluminosos; la nueva generación podría hacer que ese detalle deje de ser opcional en equipos compactos. Los portátiles, en particular, tendrán que equilibrar rendimiento y temperatura con mucho cuidado.',
      'La adopción será gradual. Es probable que los primeros dispositivos lleguen al mercado profesional, donde el costo se justifica por productividad, y que luego bajen hacia el consumo masivo. Para el jugador promedio, PCIe 6.0 no será una necesidad inmediata, pero sí una señal de hacia dónde va la industria: almacenamiento cada vez más rápido, más caliente y más integrado con el resto del sistema.',
    ],
    cita: {
      texto:
        'El ancho de banda abre la puerta, pero la experiencia real la define el conjunto. Un SSD rapidísimo rodeado de cuellos de botella sigue siendo un SSD que espera.',
      autor: 'Análisis editorial ShenzhenStock',
    },
  },
  {
    id: 'ia-creatividad',
    titulo: 'La IA generativa entra al estudio: música, video y diseño en tiempo real',
    descripcion:
      'Herramientas creativas de última generación están reduciendo la brecha entre una idea y su primera versión.',
    fecha: '03 nov 2026',
    fechaISO: '2026-11-03',
    categoria: 'IA',
    degradado: 'from-rose-500 via-pink-600 to-fuchsia-700',
    minutosLectura: 5,
    imagenes: [
      {
        src: '/novedades/ia-creatividad-1.jpg',
        alt: 'Ilustración conceptual de una onda de audio y formas de color',
        pie: 'La IA generativa acelera la creación de borradores.',
      },
      {
        src: '/novedades/ia-creatividad-22.webp',
        alt: 'Ilustración conceptual de un panel de edición con capas y video',
        pie: 'La iteración creativa se vuelve mucho más rápida.',
      },
      {
        src: '/novedades/ia-creatividad-33.webp',
        alt: 'Ilustración conceptual de una paleta de color y un cursor sobre un lienzo',
        pie: 'El criterio humano sigue definiendo el resultado final.',
      },
    ],
    puntosClave: [
      'La IA generativa se integra en el flujo creativo, no solo en la inspiración.',
      'Su mayor aporte es acelerar la iteración y la creación de borradores.',
      'Autoría, licencias y criterio humano siguen siendo el centro del debate.',
    ],
    contenido: [
      'La imagen de un artista frente a una hoja en blanco está cambiando. No porque la inspiración haya dejado de existir, sino porque ahora hay una herramienta que puede llenar esa hoja en segundos. La IA generativa se está integrando en estudios de música, video y diseño como una capa más del proceso creativo, capaz de producir borradores, variaciones y referencias a una velocidad que antes era impensable.',
      'En video, los modelos actuales permiten pasar de una descripción textual a una escena preliminar con iluminación, cámara y movimiento. En música, pueden generar bases, melodías o ambientes que sirven como punto de partida. En diseño, exploran composiciones, paletas y tipografías antes de que un humano tome decisiones. La clave no está en reemplazar el talento, sino en reducir el tiempo que separa una idea de su primera versión visible.',
      'Ese cambio tiene un impacto directo en la forma de trabajar. Los equipos pueden reunirse con decenas de propuestas en lugar de una sola, comparar caminos y descartar opciones con más información. La preproducción se vuelve más rápida y la conversación se centra en lo que funciona, no en lo que se imagina. Para proyectos con presupuesto ajustado, esa capacidad de iteración puede ser una ventaja enorme.',
      'Pero la velocidad también trae preguntas incómodas. ¿Quién es el autor de una pieza generada a partir de miles de obras anteriores? ¿Cómo se licencia? ¿Qué pasa cuando el modelo reproduce un estilo reconocible? Los estudios están aprendiendo que la transparencia no es un detalle legal, sino una condición para mantener la confianza del público y de los propios creadores.',
      'El futuro creativo probablemente no será humano contra máquina, sino humano con máquina y criterio. La IA puede encargarse de la exploración, la repetición y las variantes; la persona aporta intención, contexto y responsabilidad. Las obras que destaquen no serán las que se generen más rápido, sino las que sepan usar esa velocidad para llegar a un lugar que valga la pena.',
    ],
    cita: {
      texto:
        'La IA no reemplaza la chispa creativa. Reemplaza el tiempo que antes se gastaba en llegar a la primera versión.',
      autor: 'Análisis editorial ShenzhenStock',
    },
  },
];

export function buscarNoticia(id: string): Noticia | undefined {
  return NOTICIAS.find((noticia) => noticia.id === id);
}
