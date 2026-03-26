# ADR 002 — Plataforma de cursos custom en Firebase (no SaaS)

**Fecha:** 2026-03-26
**Estado:** Aceptado

## Contexto
Necesitamos una plataforma para vender y servir cursos de trading.
Las opciones evaluadas:

| Opción | Costo | Tiempo | Integración IA |
|--------|-------|--------|----------------|
| Teachable | $39-119/mes | 1-2 semanas | Ninguna |
| Thinkific | $49-199/mes | 1-2 semanas | Limitada |
| Custom Firebase | $0/mes | 4-6 semanas | Total |

## Decisión
**Sistema custom en Firebase** para la plataforma de cursos (Fase 4).

## Razones
1. **Costo:** $0 fee mensual vs $40-200/mes en SaaS
2. **Diseño:** 100% integrado con el tema dark/gold — SaaS tiene UI genérica
3. **Datos:** 100% propios en Firestore — SaaS tiene datos en sus servidores
4. **Auth unificado:** Firebase Auth para web + cursos — no cuentas separadas
5. **IA:** Permite integrar agentes como tutores en Fase 5
6. **Stripe:** Control total sobre el flujo de pago

## Video Hosting
Decision pendiente para Fase 4: **Mux vs Cloudflare Stream**
- Mux: mejor DX, analytics avanzados, $0.015/min almacenado
- Cloudflare Stream: más barato si hay mucho volumen, menos features

## Consecuencias
- 4-6 semanas adicionales de desarrollo en Fase 4
- Necesitamos implementar: auth, enrollment, progress, video player, certificados PDF
- Responsabilidad total sobre el mantenimiento de la plataforma
