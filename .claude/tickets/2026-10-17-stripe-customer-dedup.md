# TICKET: Deduplicar clientes de Stripe por email en el checkout

**Fecha:** 2026-10-17
**Reportado por:** Titan (auditoría de Stripe solicitada por Marcos)
**Severidad:** Media — datos sucios, riesgo de doble cobro percibido
**Repo:** investmentsmarc-platform (el checkout vive en Payment Links / flujo de venta del sitio)

## Problema
Cada compra crea un objeto `Customer` NUEVO en Stripe aunque el email ya exista.
Resultado: 10 registros duplicados sobre 28 clientes totales (cuenta `acct_1SpvEPA5lI0aineS`,
livemode, Marc Investments LLC).

Duplicados confirmados (mismo email, 2–3 registros `cus_` distintos):
- henry.delaosa@gmail.com ×2 (Henry De Laosa)
- jorgedieguez976@gmail.com ×2 (Jorge Dieguez)
- eulicesmk88@gmail.com ×3 — los 3 creados el MISMO día 2026-07-09 (reintentos de pago)
- daril8710@gmail.com ×2 (Daril Florat Reyes)
- sma220488@gmail.com ×2 (Sergio Matos)
- yosoriarodriguez@gmail.com ×2 (Yovanis Osoria)
- lachhy218@gmail.com ×2 (Lazaro Hernandez)
- christian.azahres@gmail.com ×2 (Christian Azahares)
- hildemarhernandez85@gmail.com ×2 (Hildemar Hernandez, creados 14-ago y 15-ago)

Casos especiales a investigar (no tocar sin confirmar con Marcos):
- `nova.inve@gmail.com` tiene DOS nombres distintos con 1 día de diferencia:
  "nayivis ramirez" (2026-10-06, con suscripción $70 ACTIVA) y
  "Ricardo Giovanni Flores Jauregui" (2026-10-07, sin suscripción). Puede ser email
  compartido o prueba — preguntar antes de fusionar o borrar.
- 6 personas tienen 2 suscripciones ACTIVAS ($70 PRO + $50 comunidad): Henry, Jorge,
  Daril, Sergio, Yovanis, Christian. Probablemente compraron ambos productos de forma
  legítima, pero confirmar que no haya doble cobro del mismo producto.

## Causa probable
Los links de pago (`buy.stripe.com/...`) generan Checkout Sessions sin `customer`:
Stripe crea un Customer nuevo por sesión aunque el email coincida con uno existente.

## Solución esperada
1. **Prevenir (lo importante):** antes de crear la Checkout Session, buscar cliente
   existente por email (`GET /v1/customers/search` con `query=email:'...'`). Si existe,
   pasar `customer: cus_xxx` a la sesión; si no, crear uno. Esto aplica a los dos
   productos ($70 FlowTitan PRO y $50 comunidad).
   - Si el flujo actual son Payment Links puros del dashboard, migrar a Checkout
     Sessions creadas vía API en un endpoint del sitio (p. ej. `/api/checkout`) con
     la lógica lookup-or-create.
2. **No hacer (restricción explícita de Marcos):** NO borrar ni fusionar los
   duplicados existentes que tengan suscripciones activas — son clientes oficiales
   y serios. Stripe además no permite mover una suscripción de un Customer a otro,
   así que la limpieza histórica, si se hace, es solo documentar cuál `cus_` es el
   canónico por email. Preguntar a Marcos antes de cualquier merge manual.
3. Verificar el webhook `checkout.session.completed`: debe vincular la suscripción
   al usuario de la app por email (no por `cus_` id, que puede variar).

## Criterios de aceptación
- [ ] Compra de prueba con un email que YA tiene Customer → NO se crea `cus_` nuevo;
      la suscripción queda en el Customer existente (verificable en el dashboard).
- [ ] Compra con email nuevo → se crea exactamente 1 Customer.
- [ ] Los 3 duplicados de prueba de Eulices (mismo día) no se pueden reproducir.
- [ ] Documentado cuál es el `cus_` canónico por cada email duplicado (tabla en este
      ticket o en `.claude/memory/`), sin borrar nada.

## Evidencia
Auditoría completa en el chat de Titan del 2026-10-17 (~10:43 CDT). Consultas usadas:
`GetCustomersSearch` (`created>1700000000`) y `GetSubscriptions` (`status=active`).
