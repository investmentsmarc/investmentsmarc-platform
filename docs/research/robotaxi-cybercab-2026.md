# Investigación — Robotaxi Tesla / Cybercab como negocio (septiembre 2026)

> Fecha de corte: 2026-09-09
> Origen del encargo: video de YouTube **"I Calculated Tesla Robotaxi Profits and They're INSANE"**
> (`https://youtu.be/KrMCXTtbzwA`, publicado el 17 de abril de 2026). El video corre los
> números de una flota Robotaxi partiendo de una inversión inicial de **$6,000**.
> Producto derivado: calculadora `/herramientas/robotaxi-calculator`
> (`src/components/calculators/RobotaxiFleetCalc.tsx`).

Cada dato lleva una etiqueta de confianza:

- **[Seguro]** — fuente oficial (Tesla, Uber, NHTSA, EPA, SEC) o hecho reportado por varios medios
  independientes con el mismo número.
- **[Probable]** — reportado por prensa especializada; sin confirmación oficial escrita.
- **[Suponiendo]** — no existe cifra publicada; es un supuesto de modelo y está marcado como tal.

---

## 0. Las verdades incómodas primero

1. **[Seguro] Hoy nadie puede comprar un Cybercab.** No hay botón de compra, ni precio de lista,
   ni configurador, ni depósito. Lo único que existe es un **formulario de interés para flotas**
   (`tesla.com/robotaxi/interest`), que Tesla describe como una solicitud para ser considerado,
   no una orden de compra.
2. **[Seguro] Hoy ningún dueño particular puede meter su Tesla en la red Robotaxi.** Toda la flota
   que cobra viajes es propiedad de Tesla. Tesla lleva más de un año cobrando viajes y ningún
   dueño ha ganado un dólar con FSD.
3. **[Seguro] Tesla no ha publicado el porcentaje que se quedará.** El 25–30 % que circula viene
   del Autonomy Day de 2019. Todo modelo que use ese número está suponiendo.
4. **[Seguro] Uber no tiene acuerdo con Tesla.** El CEO de Uber ha dicho que le gustaría; no hay
   contrato. Uber sí tiene más de 30 socios de vehículos autónomos (Waymo, Nuro/Lucid, Rivian,
   Baidu, etc.) y $10 mil millones comprometidos.
5. **[Seguro] Los "$6,000 de inversión" del video son un enganche.** El activo cuesta $40,000–
   $50,000 financiados. El retorno "sobre $6,000" es retorno apalancado sobre una deuda de
   ~$45,000; no es lo mismo que retorno sobre el capital total.
6. **[Seguro] El crédito fiscal federal de $7,500 ya no existe** para vehículos adquiridos después
   del 30 de septiembre de 2025 (incluye el crédito comercial 45W).

---

## 1. El video

- **[Seguro]** Título: *I Calculated Tesla Robotaxi Profits and They're INSANE*. ID `KrMCXTtbzwA`.
  Fecha: 17-abr-2026. Idioma: inglés. Tema (según el índice de búsqueda): cuánto dinero se puede
  hacer con una flota de Tesla Robotaxi, corriendo los números completos sobre una inversión de
  $6,000.
- **[Suponiendo]** El desglose exacto del video (millas/día, $/milla, comisión, seguro, etc.) no
  pudo verificarse: la política de red del entorno de trabajo bloquea YouTube y todos sus
  espejos. El sistema de cálculo se reconstruyó a partir de la estructura estándar de este tipo
  de análisis (enganche → financiamiento → ingresos por milla → comisión de plataforma →
  costos operativos → flujo de caja → retorno sobre el enganche → reinversión en más autos), con
  **todos los supuestos editables** para poder cargar los números exactos del video cuando se
  vea.

---

## 2. El auto: Tesla Cybercab

### 2.1 Precio y cómo comprarlo

| Dato | Valor | Confianza | Fuente |
|---|---|---|---|
| Precio objetivo | "menos de $30,000" | [Probable] | Musk, evento *We, Robot* (10-oct-2024); reiterado en X el 17-feb-2026 ("sí" a venderlo a consumidores antes de 2027 por $30,000 o menos) |
| Precio de lista (MSRP) | **No publicado** | [Seguro] | tesla.com no tiene configurador ni botón de orden para Cybercab |
| Venta a particulares | "antes de 2027" | [Probable] | Post de Musk en X, 17-feb-2026. Sin fecha, sin proceso, sin depósito |
| Venta a flotas | Formulario de interés desde el 3-sep-2026 | [Seguro] | `tesla.com/robotaxi/interest` — "Help Us Build Our Robotaxi Network" |
| Costo de producción | $20,000–$30,000 a escala (estimado) | [Probable] | Goldman Sachs, nota post-evento 4-sep-2026 |

**Formulario de flotas (`tesla.com/robotaxi/interest`)** [Seguro]:

- Campos: nombre, apellido, email, teléfono, empresa, región, información adicional.
- Tipo de interés (selección múltiple): *Cybercab fleet vehicle purchasing*, *Mobility hubs and
  infrastructure*, *Event collaboration*, *Other*.
- Tesla aclara que completarlo es una solicitud para ser considerado en futuras oportunidades
  Robotaxi; **no es orden de compra** ni registro de pasajero.
- **No indica**: precio, depósito, tamaño mínimo de flota, calendario de entregas, asignación
  geográfica, financiamiento ni términos de contrato.
- Va dirigido a empresas (pide nombre de la empresa). Electrek (3-sep-2026): los dueños con FSD
  siguen fuera.

### 2.2 Especificaciones (documentos EPA, junio 2026) [Seguro]

| Spec | Valor |
|---|---|
| Asientos | 2 (sin volante, sin pedales, sin espejos laterales) |
| Batería | 47.6 kWh (≈48 kWh), 326 V nominales |
| Energía desde la pared para carga completa | 53.4 kWh (implica ~11 % de pérdida por carga inductiva) |
| Eficiencia | 165 Wh/milla (0.165 kWh/mi) — el EV más eficiente certificado |
| Autonomía | 418 mi sin ajustar; ≈290 mi ajustadas (estimación de etiqueta) |
| Peso | 3,113 lb |
| Motor | 219 hp |
| Carga | **Solo inalámbrica por inducción** — no usa Supercharger |
| Entrada en comercio | 29-may-2026 |

### 2.3 Producción y despliegue

- **[Seguro]** Producción piloto en Giga Texas ~17/18-feb-2026; producción en masa desde abril de
  2026; ritmo de "varios cientos por semana" (Tesla, carta Q2 2026: producción iniciada y unidades
  de producción probándose en vía pública).
- **[Seguro]** Evento de lanzamiento: 3-sep-2026, Austin, privado (sin transmisión, prensa fuera).
- **[Seguro]** Viajes públicos en Cybercab desde el 4-sep-2026, **solo Austin**, mezclado en el
  despacho normal (no se puede pedir un Cybercab específicamente).
- **[Seguro]** Registro Texas al 2-sep-2026: 420 vehículos autónomos Tesla (375 Model Y + 45
  Cybercab). Solo una fracción opera sin supervisión (32 activos entre Austin, Dallas y Houston
  a mitad de año; Bloomberg contó 59 vehículos totales en junio).
- **[Seguro]** NHTSA abrió la auditoría **AQ26002** (3/4-sep-2026) sobre ~1,000 Cybercab para
  revisar cómo Tesla auto-certificó cumplimiento de FMVSS sin volante, pedales ni espejos. Un
  proceso similar mantuvo parado a Zoox varios años.
- **[Seguro]** Nevada aprobó (ago-2026) hasta 5,000 vehículos autónomos para Tesla Robotaxi LLC en
  los primeros 12 meses del permiso.

---

## 3. Alternativa comprable hoy: Model Y / Model 3 (hardware AI4)

| Modelo (2026) | MSRP | Confianza |
|---|---|---|
| Model Y Standard RWD | $39,990 | [Seguro] (Edmunds, Cars.com, sep-2026) |
| Model Y Long Range RWD | $44,990 | [Seguro] |
| Model Y Long Range AWD | $48,990 | [Seguro] |
| Model Y Performance | $57,990 | [Seguro] |
| Model 3 Standard RWD | $36,990 | [Seguro] |
| Model 3 Long Range AWD | $47,490 | [Seguro] |
| Cargos adicionales | $1,390 destino + $250 orden | [Seguro] |

- **Cómo se compra** [Seguro]: venta directa en `tesla.com` (orden online, cargo de orden $250,
  entrega en centro Tesla o a domicilio). Financiamiento vía Tesla Finance o banco propio.
  Empresas: Tesla for Business (misma vía, factura a nombre de la empresa).
- **Financiamiento Tesla (EE. UU., sep-2026)** [Probable]: 1.49 % APR hasta 72 meses en Model Y
  RWD/AWD/Premium (subió de 0.99 % el 3/4-sep-2026); Performance 3.99 %.
- **FSD** [Seguro]: solo suscripción, **$99/mes** ($49/mes para quien tenía Enhanced Autopilot).
  La compra única de $8,000 se eliminó el 14-feb-2026. Musk ha dicho que el precio subirá cuando
  llegue la versión sin supervisión.
- **Hardware** [Seguro]: Musk confirmó (Q1 2026) que **HW3 nunca tendrá FSD sin supervisión** y no
  podrá entrar a la red. Solo AI4/HW4 (producción desde inicios de 2023) es candidato.
- **FSD sin supervisión en autos de clientes** [Probable]: "Q4 2026 como muy pronto" (call Q1 2026);
  en el evento del 3-sep-2026 Musk habló de Texas y California "el año que viene" (2027).

---

## 4. ¿La "renta" será por Tesla o por Uber?

### 4.1 Vía Tesla — la red Robotaxi (app Tesla Robotaxi)

- **[Seguro]** Modelo anunciado: el dueño añade su auto a la red desde la app, el auto trabaja
  cuando el dueño no lo usa ("como Airbnb", "híbrido Uber/Airbnb" — Musk, 2019 y 2025).
- **[Seguro]** Estado real: **no está abierto a dueños.** Musk dijo en el call Q2 2025 "con
  confianza el año que viene" (2026). No ocurrió. Estimación realista de prensa: 2027–2028.
- **[Suponiendo]** Reparto: Tesla se quedaría 25–30 % (Autonomy Day 2019). **No hay cifra oficial
  publicada; los términos se conocerán cuando abra la inscripción.**
- **[Suponiendo]** Seguro y responsabilidad: Tesla no ha dicho quién asegura el auto de un
  particular operando en red. Hoy existen aseguradoras especializadas en flotas robotaxi
  (p. ej. Autonomy Insurance); Tesla Insurance no tiene producto publicado para esto.

### 4.2 Vía Uber

- **[Seguro]** No hay acuerdo Tesla–Uber. Khosrowshahi (feb-2025): "Nadie quiere competir contra
  Tesla o Elon, si puede evitarlo"; le gustaría que Tesla pusiera sus autos en la red de Uber
  ("ya tenemos 150,000 conductores manejando Teslas"). Musk nunca lo aceptó.
- **[Seguro]** Lo que Uber sí tiene: red de robotaxis de terceros (Waymo en Austin/Atlanta, Nuro +
  Lucid con 20,000 Gravity, Rivian con $1,250 M, Baidu, etc.), y operación de flotas vía socios
  como Hertz y Avomo/Moove. El dueño del vehículo en esos acuerdos es Uber, el fabricante o un
  operador de flota, no un particular.
- **[Seguro]** Take rate de Uber: ingresos = 24.5 % de las reservas brutas en Q2 2026 (ingresos
  $14,191 M); en Movilidad el porcentaje es mayor y estable, con margen operativo de 7.6 %.
- **[Seguro]** Lo que un particular sí puede hacer hoy con Uber: **Uber Fleet** (rentar el auto a
  conductores humanos). Renta típica $260–$330/semana por vehículo; el conductor paga
  combustible/carga; el dueño paga seguro y mantenimiento. También puede manejarlo él mismo
  (mediana en Austin: $24.27/hora, jul–ago 2026).

### 4.3 Respuesta corta

- **Hoy**: solo Uber (con conductor humano o Uber Fleet) o Turo. Nada autónomo.
- **2027+ (si Tesla cumple)**: red Robotaxi de Tesla, con el porcentaje que Tesla decida.
- **Uber + Tesla**: no existe; tratarlo como escenario hipotético.

---

## 5. Tarifas reales que cobra Tesla Robotaxi (Austin)

| Fecha | Tarifa | Confianza | Fuente |
|---|---|---|---|
| Jun-2025 | $4.20 plana | [Seguro] | Lanzamiento |
| Fin 2025 → mar-2026 | $3.00 base + $1.40/milla, sin propinas | [Probable] | Statesman, Evannex (app 25.7.10, tarifa dinámica por distancia) |
| Ago/sep-2026 | Reportes de $3.25 base + $1.00/milla | [Probable] | Basenor ("base sube a $3.25") — **contradice** el $1.40; Tesla no publica la tarifa |
| 3-sep-2026 (lanzamiento) | Model Y Montopolis → ACL Live: $19.58; Uber EV mismo trayecto: $12.96 | [Seguro] | Statesman |
| 4-sep-2026 | Mismo trayecto a Lustre Pearl East: Model Y $12.10 vs Cybercab $7.77 (−35 %) | [Seguro] | Not a Tesla App |
| 4-sep-2026 | 2.5 mi por South Congress en Cybercab: $12.15 | [Probable] | Reportes de usuarios |
| 5–7-sep-2026 | Tarifas de Cybercab suben por demanda (tarifa dinámica) | [Probable] | Tesla Oracle |
| Objetivo largo plazo | Costo operativo ~$0.20/milla; precio al pasajero $0.30–$0.40/milla con impuestos | [Probable] | Musk, *We, Robot* 2024 |

Conclusión para el modelo: **la tarifa es dinámica y Tesla no la publica**. La calculadora usa
$3.00 base + $1.40/milla como caso base y deja ambos editables. El objetivo de $0.30–$0.40/milla
de Musk, si se cumple, destruye el ingreso por milla de cualquier dueño particular: es el
escenario "conservador" de la calculadora, no una exageración.

---

## 6. Costos operativos (para los supuestos de la calculadora)

| Partida | Valor base | Confianza | Fuente |
|---|---|---|---|
| Electricidad Supercharger | $0.30–$0.50/kWh (planificación $0.45) | [Probable] | Recharged, Plaid Invoices 2026 |
| Electricidad en casa | ~$0.16/kWh → $0.04–$0.06/milla en Model Y | [Probable] | Recharged 2026 |
| Consumo Model Y | 0.28 kWh/milla (EPA); real 0.28–0.32 | [Seguro] | EPA |
| Consumo Cybercab | 0.165 kWh/milla + ~11 % pérdida inductiva ≈ 0.185 desde la pared | [Seguro] | EPA (53.4 kWh de pared por 47.6 kWh de batería) |
| Mantenimiento + llantas | $0.04–$0.06/milla | [Suponiendo] | Estimación de costo total por milla de Model Y (Autoblog/Recharged) |
| Seguro personal Model Y 2026 | ~$320/mes promedio EE. UU. | [Probable] | Insuranceopedia, MoneyGeek |
| Seguro comercial robotaxi | **Sin dato publicado**; mayor que personal | [Suponiendo] | — |
| FSD | $99/mes | [Seguro] | Tesla |
| Millas vacías (sin pasajero) | 25–35 % de las millas totales | [Suponiendo] | Ratio típico de ride-hailing |
| Depreciación | 15–25 %/año; más alta con uso comercial intensivo | [Suponiendo] | — |
| Crédito fiscal | $0 (30D, 25E y 45W terminaron el 30-sep-2025) | [Seguro] | IRS / OBBBA |

Referencias de utilización [Probable]: Waymo hace ~500,000 viajes pagados/semana con ~3,000
vehículos (≈24 viajes/vehículo/día). Goldman estima que un Cybercab a $20–30 K de costo da una
ventaja de $0.05–$0.30/milla frente a competidores con vehículos de $50–100 K.

---

## 7. El sistema de cálculo (réplica)

```
viajes/día        = millas_pagadas_día / millas_por_viaje
bruto/día         = viajes/día × tarifa_base + millas_pagadas_día × tarifa_milla
bruto/mes         = bruto/día × días_operativos
comisión          = bruto/mes × %_plataforma
neto plataforma   = bruto/mes − comisión
millas totales    = millas_pagadas_día × (1 + %_vacías) × días_operativos
energía           = millas totales × kWh/milla × $/kWh
mantenimiento     = millas totales × $/milla
fijos             = seguro + limpieza + FSD
utilidad operativa= neto plataforma − energía − mantenimiento − fijos
principal         = precio + cargos − enganche
cuota             = principal × r / (1 − (1 + r)^−n)      r = APR/12
flujo de caja     = utilidad operativa − cuota
ROI sobre enganche= flujo de caja × 12 / enganche          ← el número "INSANE" del video
ROI sobre el auto = (utilidad operativa − intereses − depreciación) × 12 / (precio + cargos)
punto equilibrio  = (fijos + cuota) / (días × [(base/millas_viaje + tarifa_milla) × (1 − %) − (1 + %_vacías) × (kWh/mi × $/kWh + mant/mi)])
```

Modo flota: simulación mensual a N meses. Con "reinvertir" activado, cada vez que el efectivo
acumulado cubre un enganche se compra otro vehículo (con su propio crédito a `n` meses). Es la
bola de nieve que este tipo de video presenta; la calculadora la muestra junto al ROI sobre el
capital total para que se vea el apalancamiento.

Modo **Uber Fleet (hoy)**: ingreso = renta semanal × 52 / 12; sin comisión por milla; el conductor
paga la carga; el dueño paga seguro, mantenimiento y limpieza. No requiere FSD.

---

## 8. Riesgos que el video no cuenta

1. **Regulatorio**: auditoría NHTSA AQ26002 abierta sobre el Cybercab; permisos estado por estado.
2. **Tarifa**: la meta declarada de Tesla es $0.30–$0.40/milla. A esa tarifa, un Model Y de $45 K
   financiado no cubre la cuota.
3. **Comisión**: 25 % es un número de 2019. Tesla puede fijar 40 % o cobrar tarifa fija.
4. **Hardware**: HW3 excluido. AI4 podría quedar detrás de AI5 para uso comercial.
5. **Seguro**: sin producto ni precio publicado para dueños particulares en red.
6. **Utilización**: las millas/día son el supuesto más sensible; Tesla no publica datos por
   vehículo. Con 45 Cybercab y ~32 Model Y sin supervisión, no hay muestra estadística.
7. **Depreciación**: 100–150 millas/día son 36,000–55,000 millas/año. El valor de reventa se
   desploma y la garantía de batería (8 años / 120,000 mi en Model Y LR) se agota en ~2.5 años.
8. **Competencia de Tesla contra sus propios dueños**: si a Tesla le sale rentable, no necesita
   vender Cybercabs; Electrek (7-sep-2026) resume el argumento: "si una flota de Cybercab fuera
   rentable, Tesla no te vendería una".

---

## 9. Fuentes

Oficiales:

- Tesla — formulario Robotaxi para flotas: https://www.tesla.com/robotaxi/interest
- Tesla — página Robotaxi: https://www.tesla.com/robotaxi · Cybercab: https://www.tesla.com/cybercab
- NHTSA — investigación auto-certificación Cybercab (AQ26002):
  https://www.nhtsa.gov/press-releases/investigation-tesla-cybercab-self-certification
- Uber — resultados Q2 2026:
  https://investor.uber.com/news-events/news/press-release-details/2026/Uber-Announces-Results-for-Second-Quarter-2026/default.aspx
- Uber — programa autónomo: https://www.uber.com/us/en/autonomous/
- Tesla — transcripción call Q2 2026:
  https://www.fool.com/earnings/call-transcripts/2026/08/05/tesla-tsla-q2-2026-earnings-call-transcript/
- IRS / AFDC — fin del crédito 30D/25E/45W: https://afdc.energy.gov/laws/13039
- Hertz — alianza con Uber para flotas robotaxi:
  https://newsroom.hertz.com/press-releases/press-release-details/hertz-and-uber-partner-to-power-autonomous-robotaxi-and-driver-led-fleet-operations/

Prensa especializada:

- TechCrunch 3-sep-2026 (formulario de flotas):
  https://techcrunch.com/2026/09/03/tesla-is-asking-people-if-they-want-to-buy-and-run-cybercab-fleets/
- TechCrunch 4-sep-2026 (NHTSA): https://techcrunch.com/2026/09/04/feds-launch-investigation-into-teslas-cybercab-deployment/
- TechCrunch 1-ago-2026 (rastreador de acuerdos AV de Uber): https://techcrunch.com/2026/08/01/ubers-autonomous-vehicle-deal-tracker/
- Electrek 3-sep-2026: https://electrek.co/2026/09/03/tesla-opens-search-for-cybercab-fleet-sales-but-fsd-owners-are-still-left-out/
- Electrek 7-sep-2026: https://electrek.co/2026/09/07/tesla-cybercab-fleet-profitable-wouldnt-sell/
- Electrek 15-jun-2026 (specs EPA): https://electrek.co/2026/06/15/tesla-cybercab-epa-specs-curb-weight-battery-motor-power/
- InsideEVs (specs EPA): https://insideevs.com/news/798790/tesla-cybercab-specs/
- Austin American-Statesman (tarifas lanzamiento):
  https://www.statesman.com/business/technology/article/austin-tesla-cybercab-launch-pricing-22417796.php
- Not a Tesla App (Cybercab más barato que Model Y): https://www.notateslaapp.com/news/4651/cybercab-joins-teslas-robotaxi-fleet-with-cheaper-fares
- Basenor (cambio de tarifa base): https://www.basenor.com/blogs/news/tesla-robotaxi-pricing-just-changed-base-fee-triples-to-3
- Tesla Oracle 7-sep-2026 (tarifas dinámicas Cybercab):
  https://www.teslaoracle.com/2026/09/07/high-demand-for-tesla-cybercab-makes-it-more-expensive-than-uber-and-the-model-y-robotaxi/
- CleanTechnica 18-feb-2026 (Musk: $30 K antes de 2027):
  https://cleantechnica.com/2026/02/18/elon-musk-says-tesla-will-sell-cybercab-to-customers-for-30000-or-less-this-year/
- Fortune 14-feb-2025 (CEO de Uber sobre Tesla):
  https://fortune.com/2025/02/14/ubers-ceo-says-no-one-wants-to-compete-with-tesla-or-elon-musk/
- Teslarati (registro TX: 375 Model Y + 45 Cybercab): https://www.teslarati.com/tesla-surges-robotaxi-fleet-ahead-of-cybercab-launch-event/
- Bloomberg 10-jun-2026 (flota de 59 vehículos):
  https://www.bloomberg.com/news/features/2026-06-10/tesla-robotaxi-fleet-totals-just-59-vehicles-despite-musk-promises
- Tesla Oracle 21-ago-2026 (Nevada, 5,000 vehículos):
  https://www.teslaoracle.com/2026/08/21/tesla-tsla-obtains-approval-for-robotaxi-service-in-nevada-including-las-vegas/
- Benzinga / Yahoo Finance (Goldman, ventaja de costo por milla):
  https://www.benzinga.com/markets/prediction-markets/26/09/61673636/tesla-cybercab-waymo-cost
- Tesorb (HW3 sin FSD sin supervisión): https://tesorb.com/tesla-hw3-fsd-upgrade-plan/
- Electrek 22-abr-2026 (FSD sin supervisión en autos de clientes, Q4 2026):
  https://electrek.co/2026/04/22/tesla-elon-musk-unsupervised-fsd-consumer-cars-q4-delay-again/
- Edmunds (precios Model Y 2026): https://www.edmunds.com/car-news/2026-tesla-model-y-pricing-guide.html
- CarsDirect (APR 1.49 %): https://www.carsdirect.com/deals-articles/2026-tesla-model-y-loses-0-apr-deal
- FSD Clarity (FSD $99/mes, fin de compra única): https://www.fsdclarity.blog/blog/tesla-fsd-subscription-price-2026-monthly-cost
- Recharged (costo Supercharger y $/milla): https://recharged.com/articles/ev-supercharger-cost-per-kwh
- Insuranceopedia (seguro Model Y 2026): https://www.insuranceopedia.com/auto-insurance/tesla-model-y-car-insurance
- Gridwise (renta Uber Fleet $260–330/semana): https://gridwise.io/blog/uber-driver-car-rental
- Axis Intelligence (utilización Waymo): https://axis-intelligence.com/waymo-statistics/
