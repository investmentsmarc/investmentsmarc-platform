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
    id: "testimonial-1",
    name: "Carlos M.",
    role: "Trader independiente",
    quote:
      "Lo que mas valoro es la claridad. Pase de operar por impulso a entender contexto, riesgo y ejecucion con una metodologia real.",
    rating: 5,
  },
  {
    id: "testimonial-2",
    name: "Daniela R.",
    role: "Estudiante de FlowTitan",
    quote:
      "El contenido combina estructura, disciplina y lectura institucional. Senti por primera vez que estaba construyendo criterio y no solo copiando entradas.",
    rating: 5,
  },
  {
    id: "testimonial-3",
    name: "Luis A.",
    role: "Inversor retail",
    quote:
      "Las herramientas y el enfoque de gestion de riesgo cambiaron mi forma de ver el mercado. Menos ruido, mejores decisiones.",
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
    title: "Dark Pools & Whales Tracking",
    description:
      "Visualiza actividad relevante y concentración de flujo para entender dónde se posiciona el dinero grande.",
  },
  {
    title: "Detección de GEX y presión gamma",
    description:
      "Añade contexto de opciones y sensibilidad del mercado para no operar estructuras a ciegas.",
  },
  {
    title: "Contexto operativo en tiempo real",
    description:
      "Unifica lectura de mercado, watchlists y capas de confirmación en una misma interfaz.",
  },
];

export const FLOWTITAN_SCREENS = [
  "Contract Detail",
  "DashBoard",
  "GEX",
  "Live Flow",
  "Whale Alerts",
  "WatchList",
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

export const COURSE_SEEDS = [
  {
    id: "flowtitan-pro",
    slug: "flowtitan-pro",
    title: "FlowTitan PRO",
    description:
      "Programa premium para traders que quieren más contexto institucional, gestión de riesgo y marco operativo avanzado.",
    price: 497,
    currency: "USD" as const,
    coverImage: "",
    tags: ["smart-money", "flujo", "opciones", "risk"],
    publishedAt: "2026-03-22",
    isActive: true,
    stripePriceId: "",
  },
  {
    id: "smart-money-basics",
    slug: "smart-money-basics",
    title: "Smart Money Basics",
    description:
      "Ruta de entrada para dominar estructura, liquidez y fundamentos del enfoque institucional.",
    price: 0,
    currency: "USD" as const,
    coverImage: "",
    tags: ["intro", "smart-money", "basics"],
    publishedAt: "2026-03-18",
    isActive: true,
    stripePriceId: "",
  },
];
