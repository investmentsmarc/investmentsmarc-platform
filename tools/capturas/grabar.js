/**
 * Grabacion v2 — por screencast de CDP, no por page.screenshot().
 *
 * v1 daba 2,4 fps: cada page.screenshot() cuesta ~400 ms en este VPS porque
 * fuerza un round-trip de renderizado. Page.startScreencast empuja el fotograma
 * cuando el compositor ya pinto, que es mucho mas barato, y ademas solo emite
 * cuando algo cambia — justo lo que interesa en una interfaz.
 *
 * Cada fotograma se guarda con su marca de tiempo real; el montaje reconstruye
 * la duracion de cada uno, asi que las pausas salen con su duracion verdadera
 * en vez de quedar aceleradas.
 */
const puppeteer = require("/var/www/flowtitan/node_modules/puppeteer-core");
const fs = require("fs");
const path = require("path");

const BASE = "https://flowtitan.investmentsmarc.com";
const SALIDA = "/tmp/clips";
const ANCHO = 1600, ALTO = 1000;
const esperar = (ms) => new Promise(r => setTimeout(r, ms));

function leerEnv() {
  const out = {};
  for (const f of ["/var/www/flowtitan/backend/.env", "/var/www/flowtitan/.env"]) {
    if (!fs.existsSync(f)) continue;
    for (const l of fs.readFileSync(f, "utf8").split("\n")) {
      const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
  return out;
}

const CURSOR = `
(() => {
  if (document.getElementById("__cur")) return;
  const c = document.createElement("div");
  c.id = "__cur";
  c.style.cssText = "position:fixed;z-index:2147483647;width:22px;height:22px;margin:-11px 0 0 -11px;" +
    "border-radius:50%;pointer-events:none;left:-99px;top:-99px;transition:left .3s cubic-bezier(.4,0,.2,1)," +
    "top .3s cubic-bezier(.4,0,.2,1);background:rgba(255,255,255,.94);box-shadow:0 0 0 2px rgba(0,0,0,.6),0 2px 12px rgba(0,0,0,.65)";
  document.body.appendChild(c);
  const p = document.createElement("style");
  p.textContent = "@keyframes __pulse{0%{transform:scale(1);opacity:1}100%{transform:scale(2.8);opacity:0}}" +
    "#__cur.__click::after{content:'';position:absolute;inset:0;border-radius:50%;border:2px solid #fff;animation:__pulse .5s ease-out}";
  document.head.appendChild(p);
})()`;

async function mover(page, x, y) {
  await page.evaluate((x, y) => {
    const c = document.getElementById("__cur");
    if (c) { c.style.left = x + "px"; c.style.top = y + "px"; }
  }, x, y);
  await esperar(380);
}
async function pulsar(page, x, y) {
  await mover(page, x, y);
  await page.evaluate(() => {
    const c = document.getElementById("__cur");
    if (c) { c.classList.remove("__click"); void c.offsetWidth; c.classList.add("__click"); }
  });
  await page.mouse.click(x, y);
}

const CLIPS = [
  {
    id: "option-chain", ruta: "/dashboard/option-chain", asentar: 16000,
    // Lo que pidio Marc: abrir una cadena y pulsar un contrato.
    async guion(page) {
      await pulsar(page, 928, 460);      // primer vencimiento de la lista
      await esperar(4000);               // la cadena tarda en poblarse

      // v1 no encontro ninguna fila con un filtro estrecho. Aqui se busca mas
      // ancho y se DEVUELVE el diagnostico, para no quedarnos sin saber por que.
      const diag = await page.evaluate(() => {
        const cand = [];
        for (const el of document.querySelectorAll("*")) {
          const r = el.getBoundingClientRect();
          if (r.left < 280 || r.top < 330 || r.top > 940) continue;
          if (r.width < 200 || r.height < 10 || r.height > 46) continue;
          const t = (el.innerText || "").trim().replace(/\s+/g, " ");
          // una fila de cadena lleva strike y precios: varios numeros
          const nums = (t.match(/\d+[.,]?\d*/g) || []).length;
          // El limite de 160 caracteres descartaba TODAS las filas: una fila de
          // cadena tiene veinte columnas y pasa de 300 sin esfuerzo. Por eso la
          // toma del 2026-09-05 abrio el vencimiento pero no pulso ningun
          // contrato, que era justo la mitad de lo pedido.
          if (nums < 4 || t.length > 420) continue;
          cand.push({ x: Math.round(r.left + r.width * 0.34), y: Math.round(r.top + r.height / 2),
                      t: t.slice(0, 46), h: Math.round(r.height), w: Math.round(r.width) });
        }
        return { n: cand.length, muestra: cand.slice(0, 4), elegida: cand[Math.min(5, cand.length - 1)] || null };
      });
      if (diag.elegida) { await pulsar(page, diag.elegida.x, diag.elegida.y); await esperar(3000); }
      else { await esperar(2000); }
      return diag;
    },
  },
  {
    id: "tape-scanner", ruta: "/dashboard/tape-scanner", asentar: 15000,
    async guion(page) {
      await pulsar(page, 1299, 162); await esperar(2600);   // DIRECTIONAL
      await pulsar(page, 1211, 162); await esperar(2600);   // UNUSUAL
      await pulsar(page, 1462, 162); await esperar(2200);   // ALL
      return {};
    },
  },
  {
    id: "gex", ruta: "/dashboard/gex", asentar: 16000,
    async guion(page) {
      await pulsar(page, 417, 565); await esperar(2800);    // Levels
      await pulsar(page, 340, 565); await esperar(2400);    // Profile
      await pulsar(page, 548, 565); await esperar(2400);    // 1h
      return {};
    },
  },
  {
    id: "advance-chart", ruta: "/chart/SPY", asentar: 17000,
    async guion(page) {
      await pulsar(page, 153, 80); await esperar(2800);     // 1h
      await pulsar(page, 200, 80); await esperar(2800);     // 1d
      await pulsar(page, 103, 80); await esperar(2400);     // 15m
      return {};
    },
  },
];

(async () => {
  const env = leerEnv();
  fs.rmSync(SALIDA, { recursive: true, force: true });
  fs.mkdirSync(SALIDA, { recursive: true });

  const b = await puppeteer.launch({
    executablePath: "/usr/bin/chromium-browser", headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu",
           "--window-size=" + ANCHO + "," + ALTO],
  });
  try {
    const page = await b.newPage();
    await page.setViewport({ width: ANCHO, height: ALTO });
    await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 30000 });
    const lg = await page.evaluate(async (e, pw) => (await fetch("/api/auth/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: e, password: pw })
    })).json(), env.FT_SCREENSHOT_EMAIL, env.FT_SCREENSHOT_PASSWORD);
    if (!(lg.user || lg.status === "ok")) { console.log("AUTH FALLIDA"); process.exit(3); }
    console.log("auth OK");

    for (const c of CLIPS) {
      const dir = path.join(SALIDA, c.id);
      fs.mkdirSync(dir, { recursive: true });
      await page.goto(BASE + c.ruta, { waitUntil: "networkidle2", timeout: 50000 });
      await esperar(c.asentar);
      await page.evaluate(CURSOR);

      const sucio = await page.evaluate(() => /POSICI[OÓ]N\(ES\) DEL PORTAFOLIO|Mi error fue claro|est[aá]s seguro/i
        .test(document.body.innerText));
      if (sucio) { console.log("SALTADO " + c.id + ": datos privados en pantalla"); continue; }

      const cdp = await page.createCDPSession();
      let n = 0;
      const tiempos = [];
      const t0 = Date.now();
      cdp.on("Page.screencastFrame", async (ev) => {
        try {
          fs.writeFileSync(path.join(dir, String(++n).padStart(4, "0") + ".jpg"),
                           Buffer.from(ev.data, "base64"));
          tiempos.push(Date.now() - t0);
          await cdp.send("Page.screencastFrameAck", { sessionId: ev.sessionId });
        } catch (e) { /* fotograma perdido */ }
      });
      await cdp.send("Page.startScreencast",
        { format: "jpeg", quality: 72, maxWidth: ANCHO, maxHeight: ALTO, everyNthFrame: 1 });

      let extra = {};
      try { extra = (await c.guion(page)) || {}; }
      catch (e) { console.log("  guion " + c.id + " fallo: " + String(e).slice(0, 80)); }

      await esperar(700);
      try { await cdp.send("Page.stopScreencast"); } catch (e) { /* ya parado */ }
      await esperar(400);
      await cdp.detach().catch(() => {});

      fs.writeFileSync(path.join(dir, "tiempos.json"), JSON.stringify(tiempos));
      const dur = tiempos.length ? tiempos[tiempos.length - 1] / 1000 : 0;
      console.log("OK " + c.id.padEnd(14) + n + " fotogramas · " + dur.toFixed(1) + "s · " +
                  (dur ? (n / dur).toFixed(1) : 0) + " fps · " + JSON.stringify(extra).slice(0, 220));
    }
  } finally { await b.close(); }
  console.log("listo");
})();
