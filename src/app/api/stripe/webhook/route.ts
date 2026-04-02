import { NextResponse } from "next/server";

export async function POST() {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      {
        ok: false,
        message: "Webhook de Stripe no configurado todavia.",
      },
      { status: 501 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Endpoint preparado para verificar firma y actualizar enrollments.",
  });
}
