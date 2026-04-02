import { NextResponse } from "next/server";

import { COURSE_SEEDS } from "@/lib/content";

export async function POST(request: Request) {
  const { slug } = (await request.json()) as { slug?: string };
  const course = COURSE_SEEDS.find((item) => item.slug === slug);

  if (!course) {
    return NextResponse.json({ ok: false, message: "Curso no encontrado." }, { status: 404 });
  }

  if (!process.env.STRIPE_SECRET_KEY || !course.stripePriceId) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Stripe no configurado todavia. Manteniendo el wiring de checkout a nivel de arquitectura.",
      },
      { status: 501 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Punto de checkout listo para integrar sesión real de Stripe.",
  });
}
