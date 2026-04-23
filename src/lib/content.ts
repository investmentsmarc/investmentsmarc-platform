import type {
  BlogPost,
  FaqItem,
  LegalSection,
  LinkCardItem,
  Testimonial,
  ValueItem,
  WhatsAppOption,
} from "@/types";

export const BLOG_POSTS: BlogPost[] = [
  {
    _id: "post-1",
    slug: "las-siete-magnificas-en-2026",
    title: "Las Siete Magnificas en 2026: El Crash del 17%",
    excerpt:
      "Que nombres siguen liderando el flujo y donde empiezan a aparecer zonas de distribucion institucional.",
    category: "Analisis de Mercado",
    publishedAt: "2026-03-20",
    readingTime: 6,
    body: [
      "Las Siete Magnificas siguen siendo el termometro del apetito por riesgo, pero su lectura correcta ya no pasa solo por momentum. El mercado empieza a premiar balance sheets mas resilientes y castiga narrativas sobreextendidas.",
      "Cuando el flujo institucional se concentra, la pregunta no es solo quien sube mas, sino quien sigue absorbiendo liquidez sin deteriorar estructura. Ahí es donde se separan los lideres reales de los rebotes emocionales.",
      "Para traders e inversores, el foco debe estar en contexto, posicionamiento y confirmacion. La narrativa importa, pero la ejecucion disciplinada importa mas.",
    ],
  },
  {
    _id: "post-2",
    slug: "fed-2026-recortes-pausados",
    title: "La Fed en 2026: Recortes Pausados, Inflacion Resistente",
    excerpt:
      "Un mapa práctico para traducir tono macro en sesgo operativo sobre índices, dólar y sectores sensibles a tipos.",
    category: "Analisis de Mercado",
    publishedAt: "2026-03-17",
    readingTime: 5,
    body: [
      "El escenario de recortes pausados crea un mercado menos complaciente. La sensibilidad a datos vuelve a dominar y los activos de duration larga reaccionan de forma mas violenta ante cualquier sorpresa.",
      "En este entorno, la clave está en identificar cuando el mercado ya descontó el mensaje de la Fed y cuando todavía hay espacio para repricing. Esa diferencia define la calidad de las entradas.",
      "Operar la macro no significa adivinar titulares. Significa entender como cambian los flujos entre indices, bonos, dólar y sectores de crecimiento.",
    ],
  },
  {
    _id: "post-3",
    slug: "aranceles-trump-2026",
    title: "Aranceles Trump 2026: La Guerra Comercial Escala",
    excerpt:
      "Como la tensión comercial reordena riesgo sectorial y genera oportunidades tácticas para capital paciente.",
    category: "Analisis de Mercado",
    publishedAt: "2026-03-14",
    readingTime: 4,
    body: [
      "Las medidas arancelarias vuelven a introducir fricción en cadenas de suministro y percepción de riesgo. El impacto no es uniforme: afecta margenes, expectativas y rotación sectorial de forma desigual.",
      "La lectura institucional exige separar ruido político de consecuencias en beneficios, pricing power y asignación de capital.",
    ],
  },
  {
    _id: "post-4",
    slug: "geopolitica-2026",
    title: "Geopolitica 2026: Paz en Ucrania, Tension en Asia",
    excerpt:
      "Una lectura de cómo los eventos geopolíticos alteran rotación, commodities y sentimiento global.",
    category: "Analisis de Mercado",
    publishedAt: "2026-03-10",
    readingTime: 4,
    body: [
      "La geopolítica no se opera por titulares aislados. Se opera por la manera en que altera correlaciones, prima de riesgo y narrativa en commodities, energía, defensa y divisas.",
      "Cuando el mercado mezcla alivio en un frente y tensión en otro, la volatilidad relativa entre activos se vuelve una fuente real de oportunidad.",
    ],
  },
  {
    _id: "post-5",
    slug: "smart-money-concepts",
    title: "Smart Money Concepts: Como los Institucionales Mueven los Mercados",
    excerpt:
      "Una introducción operativa a estructura, liquidez y desplazamiento para dejar atrás entradas reactivas.",
    category: "Trading Institucional",
    publishedAt: "2026-03-12",
    readingTime: 8,
    body: [
      "Smart Money Concepts no es un conjunto de dibujos en el gráfico. Es una forma de leer intención, contexto y secuencia para identificar dónde se producen las verdaderas decisiones del mercado.",
      "La liquidez es el combustible del movimiento. Entender dónde está, quién la persigue y qué estructura la rodea te permite dejar de perseguir velas y empezar a pensar como operador profesional.",
      "El objetivo no es predecir cada tick, sino construir un marco repetible para entrar, proteger y salir con criterio.",
    ],
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t-ricardo",
    name: "Ricardo M.",
    role: "Médico internista · 47 años · Venezuela → Houston",
    quote:
      "Yo llegué a Marc con casi 18 mil dólares perdidos siguiendo señales de Telegram. Lo que no esperaba es que él no me iba a dar «la receta», me iba a enseñar a cocinar. La primera sesión me voló la cabeza cuando me mostró cómo leer un dark pool print. Llevaba 20 años operando y nunca había visto el mercado desde ahí. Para la sesión 6 ya hacía mi propia tesis sobre AMD antes de earnings, cruzando GEX con posicionamiento institucional. Llevo 9 meses verde de forma consistente. Marc no te vende promesas. Te enseña a ver.",
    rating: 5,
  },
  {
    id: "t-daniela",
    name: "Daniela P.",
    role: "Emprendedora · agencia de marketing · 39 años · CDMX",
    quote:
      "Empecé escéptica. He pagado cursos de 3 mil dólares donde me enseñaban a dibujar rayitas y ya. Con Marc fue otra cosa: él te lleva a entender quién está del otro lado de tu operación. En la sesión 3, cuando me explicó cómo los market makers usan el GEX para cubrirse y cómo eso mueve el precio intradía, literalmente dije «ah, por eso». Llevaba dos años sin poder explicármelo. Mi cuenta pasó de 42k a 58k en cinco meses con coberturas y entradas con confluencia. Pero lo más valioso es que ahora duermo tranquila.",
    rating: 5,
  },
  {
    id: "t-andres",
    name: "Andrés V.",
    role: "Ingeniero de software · 28 años · Medellín",
    quote:
      "Parce, yo venía quemado. 14 mil dólares perdidos apostando en cada earnings. Marc fue el primero que me dijo en la cara «tú no estás operando, estás apostando». Y tenía razón. Lo que más me sirvió fue aprender tape reading en serio: order flow, bloques institucionales, sweeps. Para un ingeniero eso es oro puro porque es data real, no cuentos. Hoy llevo 7 meses con método. No abro una posición sin tres razones escritas. Mi mejor mes fue +11%, mi peor −2%. Antes era impensable.",
    rating: 5,
  },
  {
    id: "t-mariela",
    name: "Mariela S.",
    role: "Ama de casa · 43 años · Lima",
    quote:
      "Yo no vengo de finanzas. Mi esposo me regaló una cuenta de 8 mil dólares y me dijo «aprende». Probé de todo, hasta un «mentor» que resultó ser un muchacho de 22 años. Lo que me gustó de Marc es que me trató con respeto desde la primera llamada. El antes y después fue la sesión donde me enseñó análisis fundamental real: leer un 10-K, márgenes, flujo de caja libre. Empecé a elegir empresas yo sola. Hoy tengo tres posiciones que entiendo, vendo covered calls cada mes, y mi cuenta está en 14 mil. Para mí eso es libertad.",
    rating: 5,
  },
  {
    id: "t-fernando",
    name: "Fernando R.",
    role: "Profesor universitario de economía · 54 años · Buenos Aires",
    quote:
      "Voy a decir algo polémico: yo enseño economía financiera y Marc me enseñó cosas que no están en los libros. Yo tenía el marco teórico, pero no sabía leer el tape ni el posicionamiento de opciones. La parte de GEX y cómo afecta la volatilidad intradía fue revelador. En la sesión 8 hicimos juntos un análisis completo de Meta antes de earnings, cruzando técnico, fundamental e institucional. Salió una tesis limpia y un spread que funcionó exactamente como lo planeamos. Lo recomiendo a mis colegas sin reservas.",
    rating: 5,
  },
  {
    id: "t-luis",
    name: "Luis A.",
    role: "Dueño de restaurante · 49 años · Miami",
    quote:
      "Mira, yo te hablo claro. Llevaba tres años metiéndole a la bolsa sin saber qué coño estaba haciendo. Compraba lo que decía la tele. Lo primero que Marc me dijo fue «deja de ver CNBC», porque las instituciones ya se posicionaron antes. Él me enseñó a ver dónde está el dinero grande antes de que el precio se mueva: dark pools, unusual options activity, sweeps de millones minutos antes de la noticia. Si tú sabes quién compra el pescado al mayorista, sabes qué se va a vender la otra semana. Es lo mismo. Llevo 10 meses con método, mi cuenta subió 38%. Marc no te vende, te forma.",
    rating: 5,
  },
  {
    id: "t-camila",
    name: "Camila T.",
    role: "Recién graduada en finanzas · 25 años · Quito",
    quote:
      "Estudié finanzas y cuando salí pensé que estaba lista. En seis meses perdí el 40% de mis ahorros. Tenía el vocabulario pero no el oficio. A Marc le pedí literalmente «enséñame a ver el mercado como lo ven los que saben». Y lo hizo. Lo que más me impactó fue aprender tape reading de verdad: ver cómo se construye una posición institucional a lo largo del día, cómo absorben el papel, cómo se defienden ciertos niveles. Hoy opero swing de 3 a 10 días con confluencia entre GEX, flujo institucional y técnico. Llevo cuatro meses positiva.",
    rating: 5,
  },
  {
    id: "t-patricio",
    name: "Patricio N.",
    role: "Contador público · 37 años · Santiago de Chile",
    quote:
      "Lo que me marcó fue la disciplina. Soy contador, ordenado con números, pero en el mercado me ponía emocional. En la segunda sesión Marc me dijo «tú no tienes problema de análisis, tienes problema de gestión». Me hizo armar un plan escrito por operación: tesis, niveles, riesgo, objetivo, invalidación. Desde la sesión 5 entraron las herramientas institucionales y todo se conectó: strikes con más gamma, flujo de opciones, cuándo los market makers tienen que cubrirse. Mi cuenta creció 24% en los seis meses siguientes. Real, sostenible, y entiendo cada peso.",
    rating: 5,
  },
  {
    id: "t-yolanda",
    name: "Yolanda C.",
    role: "Enfermera · 45 años · San Juan de Puerto Rico",
    quote:
      "Trabajo turnos de 12 horas, no puedo estar pegada a una pantalla. Marc me armó un plan adaptado: swing más largo, covered calls mensuales sobre mis acciones, revisión semanal. Las 10 sesiones me las dio con paciencia, porque yo llegaba muerta del hospital. Lo que aprendí de fundamental me permite tomar decisiones en empresas que entiendo (tengo dos farmacéuticas que analicé yo desde los reportes), y los covered calls se volvieron un ingreso extra. El año pasado generé unos $4,200 solo en primas. Para mí eso es la luz y el agua de varios meses.",
    rating: 5,
  },
  {
    id: "t-jose",
    name: "José Ramón B.",
    role: "Dentista · 52 años · Santo Domingo",
    quote:
      "Uno aprende mejor cuando alguien te lleva de la mano. Por eso las 10 sesiones en vivo con Marc me funcionaron: uno pregunta y él te responde ahí, te corrige si estás viendo mal un gráfico, te muestra en su pantalla cómo lee la misma situación. Lo que más me impresionó fue cuando me mostró una operación suya en Amazon: vio el flujo de opciones entrando, el dark pool print, y eso coincidió con un nivel técnico que él tenía marcado. Ahí entendí que esto no es adivinar, es leer la evidencia. Ya no entro por corazonadas, entro por tesis.",
    rating: 5,
  },
];

export const ABOUT_STORY = [
  'Soy Marcos Martinez ("Marc"), esposo, padre de tres hijos y un operador obsesionado con entender como se mueve realmente el capital institucional.',
  "Mi historia empieza en Cuba, donde me formé como ingeniero en sistemas y aprendí a mirar problemas complejos desde la lógica. En 2017 salí a Mexico buscando libertad, y fue ahí donde descubrí que el mercado no solo era una salida financiera: era un sistema que podía estudiarse con disciplina.",
  "Desde entonces me dediqué a unir análisis, estructura y ejecución. Investments Marc nace de esa convicción: enseñar a traders e inversores serios a dejar atrás el ruido y operar con un marco profesional.",
];

export const ABOUT_QUOTE =
  "Cuando el 2020 sacudió al mundo, entendí que no bastaba con reaccionar al precio: había que descifrar el código del flujo institucional y construir una metodología propia.";

export const FLOWTITAN_FEATURES = [
  {
    title: "Whales & Dark Pool Tracking",
    kicker: "Institucional · $150K+ tier",
    description:
      "Detecta posiciones institucionales de $150K+ en tiempo real, rastrea entry price, ROI y rolls. Ve dónde se posiciona el smart money antes de que el mercado lo descuente.",
  },
  {
    title: "GEX Engine & Gamma Pressure",
    kicker: "Gamma · Vanna · Charm",
    description:
      "Calcula gamma, vanna y charm con Black-Scholes vectorizado. Identifica flip points, muros de liquidez y zonas de imán gamma para operar con contexto, no adivinanzas.",
  },
  {
    title: "Confluence Engine de 15 Capas",
    kicker: "15 capas · ~35s por análisis",
    description:
      "Análisis forense multi-capa: flujo, GEX, rolling, sector, macro, sentiment, técnico, IV regime y más. Score de confluencia en ~35 segundos — decide con evidencia, no con fe.",
  },
  {
    title: "TITAN AI — Director de Inteligencia",
    kicker: "Agente IA · 16 herramientas propietarias",
    description:
      "Agente IA con acceso a 16 herramientas propietarias: forensic reports, IV crush, option chain snapshots, whale ledger y visualización on-demand.",
  },
  {
    title: "Tape Scanner Institucional",
    kicker: "SWEEP · BLOCK · MULTI-LEG",
    description:
      "Filtros premium por tier ($150K–$1M+) que eliminan ruido retail. Clasificación ML (SWEEP, BLOCK, MULTI-LEG) con dirección (BULLISH/BEARISH) inline.",
  },
  {
    title: "Contexto Operativo en Tiempo Real",
    kicker: "WebSocket · Watchlists · Alerts",
    description:
      "Watchlists, alertas, dashboard y capas de confirmación sincronizadas vía WebSocket. Una sola pantalla para leer, validar y ejecutar.",
  },
];

export const FLOWTITAN_SCREENS = [
  "Whale Ledger",
  "GEX Engine",
  "Confluence",
  "TITAN AI",
  "Tape Scanner",
  "Command Center",
];

export const CORE_VALUES: ValueItem[] = [
  {
    id: "transparencia",
    icon: "01",
    title: "Transparencia",
    description:
      "Sin promesas mágicas ni marketing vacío. Explicamos el porqué detrás de cada framework y decisión.",
  },
  {
    id: "disciplina",
    icon: "02",
    title: "Disciplina",
    description:
      "El edge no se sostiene sin proceso. Enseñamos estructura y repetición por encima del impulso.",
  },
  {
    id: "constancia",
    icon: "03",
    title: "Constancia",
    description:
      "La construcción de criterio requiere tiempo, revisión y consistencia operativa.",
  },
  {
    id: "paciencia",
    icon: "04",
    title: "Paciencia",
    description:
      "No todas las sesiones merecen una operación. Esperar el contexto correcto también es una ventaja.",
  },
  {
    id: "sin-atajos",
    icon: "05",
    title: "Sin Atajos",
    description:
      "No vendemos fantasía. Preferimos un marco robusto que sobreviva a diferentes ciclos de mercado.",
  },
  {
    id: "resultados",
    icon: "06",
    title: "Resultados",
    description:
      "Buscamos mejora medible: mejor lectura, mejor gestión de riesgo y mejor toma de decisiones.",
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-1",
    question: "¿Qué es Investments Marc?",
    answer:
      "Es una plataforma educativa enfocada en trading institucional, gestión de riesgo y lectura profesional del mercado.",
  },
  {
    id: "faq-2",
    question: "¿Necesito experiencia previa para empezar?",
    answer:
      "No necesariamente. Hay recursos introductorios, pero el enfoque está pensado para personas que quieren tomarse el mercado en serio.",
  },
  {
    id: "faq-3",
    question: "¿Qué es Smart Money Concepts?",
    answer:
      "Es un marco de lectura que pone foco en estructura, liquidez y desplazamiento para entender cómo actúa el capital institucional.",
  },
  {
    id: "faq-4",
    question: "¿Las herramientas son gratuitas?",
    answer:
      "Sí. El hub de herramientas está pensado como capa pública para ayudar a mejorar la toma de decisiones antes de operar.",
  },
  {
    id: "faq-5",
    question: "¿También hay cursos de pago?",
    answer:
      "Sí. La plataforma contempla programas más profundos, recursos y rutas guiadas para traders que quieren acelerar su curva.",
  },
  {
    id: "faq-6",
    question: "¿Qué mercados cubren?",
    answer:
      "Principalmente índices, acciones, opciones, ETFs y estructuras vinculadas a flujo institucional y macro.",
  },
  {
    id: "faq-7",
    question: "¿Con qué frecuencia publican análisis?",
    answer:
      "De forma consistente, priorizando calidad y contexto útil sobre volumen vacío o ruido de corto plazo.",
  },
  {
    id: "faq-8",
    question: "¿Esto es asesoría financiera personalizada?",
    answer:
      "No. Todo el contenido es educativo y no sustituye asesoría financiera, legal o fiscal individual.",
  },
  {
    id: "faq-9",
    question: "¿Cómo contacto al equipo?",
    answer:
      "El canal principal es WhatsApp y el formulario de contacto. Ambos quedan conectados al sistema de leads.",
  },
  {
    id: "faq-10",
    question: "¿Qué es FlowTitan PRO?",
    answer:
      "Es la capa premium del ecosistema, pensada para traders que quieren operar con más contexto de flujo y herramientas profesionales.",
  },
];

export const LEGAL_CONTENT: Record<string, { title: string; intro: string; sections: LegalSection[] }> = {
  privacidad: {
    title: "Politica de Privacidad",
    intro:
      "Esta política describe cómo recopilamos, usamos y protegemos la información que compartes con Investments Marc al navegar el sitio o al registrarte en nuestros formularios.",
    sections: [
      {
        heading: "Información que recopilamos",
        paragraphs: [
          "Podemos recopilar datos personales como nombre, email y número de WhatsApp cuando completas formularios de contacto, curso gratuito o webinar.",
          "También recopilamos información básica de uso y navegación para mejorar la experiencia del sitio y medir rendimiento.",
        ],
      },
      {
        heading: "Uso de la información",
        paragraphs: [
          "La información se utiliza para responder consultas, enviar acceso a recursos, dar seguimiento comercial y mejorar productos y contenido.",
          "No vendemos tu información personal a terceros.",
        ],
      },
      {
        heading: "Servicios de terceros",
        paragraphs: [
          "Podemos apoyarnos en Firebase, Sanity, Stripe, ConvertKit y otros proveedores técnicos para operar la plataforma.",
          "Cada servicio externo aplica además sus propias políticas de tratamiento de datos.",
        ],
      },
      {
        heading: "Tus derechos",
        paragraphs: [
          "Puedes solicitar actualización o eliminación de tu información escribiéndonos por nuestros canales de contacto.",
        ],
      },
    ],
  },
  terminos: {
    title: "Terminos de Uso",
    intro:
      "Al acceder a Investments Marc aceptas usar este sitio y sus recursos con fines informativos y educativos, bajo tu propia responsabilidad.",
    sections: [
      {
        heading: "Naturaleza educativa",
        paragraphs: [
          "El contenido publicado tiene fines educativos y no constituye recomendación de inversión, asesoría financiera o promesa de resultados.",
          "Toda decisión operativa o de inversión debe ser evaluada por el usuario según su contexto.",
        ],
      },
      {
        heading: "Propiedad intelectual",
        paragraphs: [
          "Los materiales, clases, herramientas y recursos del sitio pertenecen a Investments Marc salvo indicación contraria.",
          "No está permitida su redistribución sin autorización expresa.",
        ],
      },
      {
        heading: "Limitación de responsabilidad",
        paragraphs: [
          "No garantizamos exactitud absoluta, disponibilidad continua ni resultados específicos derivados del uso del contenido.",
          "El usuario asume el riesgo de cualquier decisión tomada con base en el material educativo.",
        ],
      },
      {
        heading: "Contacto",
        paragraphs: [
          "Para dudas legales o comerciales puedes escribirnos por WhatsApp o mediante el formulario de contacto del sitio.",
        ],
      },
    ],
  },
};

export const LINK_PAGE_ITEMS: LinkCardItem[] = [
  {
    label: "Habla con nosotros por WhatsApp",
    href: "https://wa.me/18329534918?text=Hola%20Marc!%20Vi%20tu%20perfil%20de%20Instagram%20y%20quiero%20mas%20informacion.",
    description: "Canal directo para dudas rápidas y seguimiento.",
    highlighted: true,
  },
  {
    label: "Curso Gratis: Smart Money Basics",
    href: "/curso-gratis",
    description: "Empieza con una base clara y accionable.",
    highlighted: true,
  },
  {
    label: "Plataforma de Cursos",
    href: "/cursos",
    description: "Explora la base de la plataforma educativa.",
  },
  {
    label: "Calculadoras de Trading",
    href: "/herramientas",
    description: "Herramientas públicas para mejorar tu ejecución.",
  },
  {
    label: "Analisis de Mercado",
    href: "/blog",
    description: "Contexto macro y lectura institucional.",
  },
  {
    label: "Sitio Web Oficial",
    href: "/",
    description: "Navega el ecosistema completo de Investments Marc.",
  },
];

export const WHATSAPP_OPTIONS: WhatsAppOption[] = [
  {
    title: "Cursos y programas",
    description: "Si quieres orientación sobre rutas de aprendizaje, cursos o acceso a programas.",
    message: "Hola Marc, quiero informacion sobre sus cursos y programas.",
  },
  {
    title: "Consulta de trading",
    description: "Para comentar tu etapa actual y entender qué herramienta o framework te conviene más.",
    message: "Hola Marc, quiero hablar sobre mi proceso de trading y saber como me pueden orientar.",
  },
  {
    title: "Contacto general",
    description: "Para colaboraciones, preguntas rápidas o seguimiento comercial general.",
    message: "Hola Marc, quiero comunicarme con ustedes por una consulta general.",
  },
];

export const WEBINAR_BENEFITS = [
  "Cómo leer estructura y liquidez sin depender del ruido del mercado.",
  "Qué errores destruyen la consistencia aunque tengas buenas entradas.",
  "Cómo construir un proceso de riesgo y ejecución más profesional.",
  "Bonus con siguiente paso recomendado según tu perfil actual.",
];

// Ruta del Inversor — Academia Marc Investments, progresión 1 → 5
export const COURSE_SEEDS = [
  {
    id: "genesis",
    slug: "genesis",
    order: 1,
    codename: "GÉNESIS",
    title: "De Cero a Inversor",
    kicker: "Fundamentos del Stock Market · Mentalidad del Capital",
    description:
      "Forja la mentalidad que separa al especulador del inversor. Aprende cómo funciona realmente la bolsa, por qué el 90% pierde y cómo posicionarte en el 10% que construye riqueza.",
    price: 0,
    currency: "USD" as const,
    coverImage: "",
    tags: ["fundamentos", "mentalidad", "beginner"],
    publishedAt: "2026-04-01",
    isActive: true,
    stripePriceId: "",
  },
  {
    id: "cartografia",
    slug: "cartografia",
    order: 2,
    codename: "CARTOGRAFÍA",
    title: "El Lenguaje del Precio",
    kicker: "Análisis Técnico · Lectura de Charts",
    description:
      "Domina el mapa del mercado. Estructura, soportes, resistencias, volumen, patrones y timing — para que cada gráfico te hable antes de que hagas click.",
    price: 297,
    currency: "USD" as const,
    coverImage: "",
    tags: ["tecnico", "charts", "price-action"],
    publishedAt: "2026-04-02",
    isActive: true,
    stripePriceId: "",
  },
  {
    id: "rayos-x",
    slug: "rayos-x",
    order: 3,
    codename: "RAYOS X",
    title: "La Anatomía de una Empresa",
    kicker: "Análisis Fundamental · Valuación de Compañías",
    description:
      "Disecciona balances, márgenes y valuaciones como un analista de Wall Street. Identifica compañías de alta salud financiera antes de que el mercado las descubra.",
    price: 397,
    currency: "USD" as const,
    coverImage: "",
    tags: ["fundamental", "valuacion", "balance"],
    publishedAt: "2026-04-03",
    isActive: true,
    stripePriceId: "",
  },
  {
    id: "arsenal",
    slug: "arsenal",
    order: 4,
    codename: "ARSENAL",
    title: "Maestría en Opciones",
    kicker: "Master de Opciones · Estrategias de Alto Apalancamiento",
    description:
      "Desbloquea el instrumento financiero más poderoso del mercado. Calls, puts, spreads, covered calls, wheels e iron condors — con Greeks, IV y gestión de riesgo profesional.",
    price: 597,
    currency: "USD" as const,
    coverImage: "",
    tags: ["opciones", "spreads", "greeks"],
    publishedAt: "2026-04-04",
    isActive: true,
    stripePriceId: "",
  },
  {
    id: "oraculo",
    slug: "oraculo",
    order: 5,
    codename: "ORÁCULO",
    title: "Tape Reading Institucional",
    kicker: "Flujo Institucional · GEX · Dark Pools",
    description:
      "El curso más avanzado del ecosistema. Aprende a leer el tape como los market makers, detectar whales en tiempo real, interpretar gamma exposure y operar al lado del smart money — no en su contra.",
    price: 997,
    currency: "USD" as const,
    coverImage: "",
    tags: ["smart-money", "gex", "dark-pools", "tape"],
    publishedAt: "2026-04-05",
    isActive: true,
    stripePriceId: "",
  },
];
