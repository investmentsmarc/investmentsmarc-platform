// =============================================================================
// INVESTMENTS MARC — Tipos compartidos
// =============================================================================

// --- Blog / Sanity ----------------------------------------------------------

export interface BlogPost {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: "Analisis de Mercado" | "Trading Institucional" | "Educacion" | "Herramientas";
  publishedAt: string;
  coverImage?: string;
  body?: unknown; // Portable Text desde Sanity
  readingTime?: number;
}

// --- Cursos (Fase 4) --------------------------------------------------------

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  currency: "USD";
  coverImage?: string;
  lessons: Lesson[];
  tags: string[];
  publishedAt: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  videoUrl?: string;
  duration: number; // segundos
  order: number;
  isFree: boolean;
}

export interface Enrollment {
  userId: string;
  courseId: string;
  enrolledAt: string;
  stripeSessionId: string;
}

export interface Progress {
  userId: string;
  courseId: string;
  lessonId: string;
  completedAt: string;
}

// --- Lead Capture -----------------------------------------------------------

export interface LeadFormData {
  name: string;
  email: string;
  whatsapp?: string;
  source: "curso-gratis" | "webinar" | "contacto";
  createdAt?: string;
}

export interface WebinarFormData {
  fullName: string;
  email: string;
  whatsapp: string;
  createdAt?: string;
}

// --- Testimonios ------------------------------------------------------------

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  avatarUrl?: string;
  quote: string;
  rating?: 1 | 2 | 3 | 4 | 5;
}

export interface ValueItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

export interface LinkCardItem {
  label: string;
  href: string;
  description: string;
  highlighted?: boolean;
}

export interface WhatsAppOption {
  title: string;
  description: string;
  message: string;
}

// --- Navigation -------------------------------------------------------------

export interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
  children?: NavItem[];
}
