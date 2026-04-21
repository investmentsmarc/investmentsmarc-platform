"use client";

import { useEffect, useRef } from "react";

type Flow = {
  phase: number;
  speed: number;
  amp: number;
  freq: number;
  y: number;
  alpha: number;
  width: number;
};

type Particle = { x: number; y: number; z: number; vx: number; vy: number; r: number; a: number };
type Node = { x: number; y: number; vx: number; vy: number; pulse: number };
type Candle = { i: number; up: boolean; h: number; life: number };

const VERTEX_SRC = `
attribute vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAGMENT_SRC = `
precision highp float;
uniform vec2  uRes;
uniform float uTime;
uniform vec2  uMouse;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  float a = hash(i),
        b = hash(i + vec2(1.0, 0.0)),
        c = hash(i + vec2(0.0, 1.0)),
        d = hash(i + vec2(1.0, 1.0));
  vec2 u = f*f*(3.0 - 2.0*f);
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.04; a *= 0.5; }
  return v;
}

void main(){
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  vec2 m = (uMouse - 0.5) * vec2(uRes.x / uRes.y, -1.0);

  // Dual warm anchors: top-right hot + bottom-left glow — keeps footer area alive
  float r1 = length(p - vec2(0.35, 0.30));
  float r2 = length(p - vec2(-0.40, -0.32));
  vec3 col = mix(vec3(0.022, 0.017, 0.012), vec3(0.0), smoothstep(0.0, 1.6, r1));
  col += vec3(0.032, 0.024, 0.012) * smoothstep(1.4, 0.2, r1);
  col += vec3(0.020, 0.015, 0.008) * smoothstep(1.4, 0.2, r2);

  vec2 q = p * 1.5;
  q.x += 0.45 * fbm(q + vec2(uTime * 0.045, 0.0));
  q.y += 0.45 * fbm(q + vec2(0.0, uTime * 0.035));
  float n = fbm(q * 1.25 + uTime * 0.015);
  vec3 gold    = vec3(0.79, 0.66, 0.30);
  vec3 goldHot = vec3(0.96, 0.84, 0.48);
  col += gold * pow(n, 2.1) * 0.38;
  col += goldHot * pow(n, 4.2) * 0.20;

  float md = length(p - m);
  col += goldHot * 0.42 * exp(-md * 3.1);
  col += gold    * 0.25 * exp(-md * 1.3);

  float gy = abs(fract(p.y * 14.0 + uTime * 0.12) - 0.5);
  float gx = abs(fract(p.x * 22.0 - uMouse.x * 0.1) - 0.5);
  float lineY = smoothstep(0.022, 0.000, gy);
  float lineX = smoothstep(0.018, 0.000, gx);
  float gridFade = smoothstep(0.95, 0.0, p.y + 0.05) * smoothstep(-0.95, -0.1, p.y);
  col += gold * (lineY * 0.06 + lineX * 0.04) * gridFade;

  // Gentle vignette — no longer darkens edges aggressively, so footer stays alive
  float vig = smoothstep(1.45, 0.35, length(p));
  col *= 0.84 + 0.26 * vig;

  float grain = hash(gl_FragCoord.xy + vec2(uTime * 73.0, uTime * 41.0));
  col += (grain - 0.5) * 0.018;

  col = pow(max(col, 0.0), vec3(0.94));

  gl_FragColor = vec4(col, 1.0);
}
`;

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn("[TradingShader] compile error:", gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

type TradingShaderProps = {
  variant?: "hero" | "global";
};

export function TradingShader({ variant = "hero" }: TradingShaderProps = {}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HTMLCanvasElement | null>(null);
  const fxRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    const bg = bgRef.current;
    const fx = fxRef.current;
    if (!host || !bg || !fx) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const ctx = fx.getContext("2d");
    const gl = (bg.getContext("webgl2") ||
      bg.getContext("webgl") ||
      bg.getContext("experimental-webgl")) as WebGLRenderingContext | null;

    if (!ctx) return;

    let W = 0;
    let H = 0;
    let DPR = 1;
    const mouse = { x: 0.65, y: 0.45, tx: 0.65, ty: 0.45 };

    let program: WebGLProgram | null = null;
    let uRes: WebGLUniformLocation | null = null;
    let uTime: WebGLUniformLocation | null = null;
    let uMouse: WebGLUniformLocation | null = null;
    let ready = false;

    if (gl) {
      const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SRC);
      const fsh = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
      if (vs && fsh) {
        const prog = gl.createProgram();
        if (prog) {
          gl.attachShader(prog, vs);
          gl.attachShader(prog, fsh);
          gl.linkProgram(prog);
          if (gl.getProgramParameter(prog, gl.LINK_STATUS)) {
            program = prog;
            gl.useProgram(program);
            const buf = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buf);
            gl.bufferData(
              gl.ARRAY_BUFFER,
              new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
              gl.STATIC_DRAW,
            );
            const aPos = gl.getAttribLocation(program, "aPos");
            gl.enableVertexAttribArray(aPos);
            gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
            uRes = gl.getUniformLocation(program, "uRes");
            uTime = gl.getUniformLocation(program, "uTime");
            uMouse = gl.getUniformLocation(program, "uMouse");
            ready = true;
          }
        }
      }
    }

    const particles: Particle[] = Array.from({ length: 90 }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.4 + Math.random() * 0.9,
      vy: 0.0003 + Math.random() * 0.0009,
      vx: (Math.random() - 0.5) * 0.0004,
      r: 0.4 + Math.random() * 1.3,
      a: 0.18 + Math.random() * 0.5,
    }));

    const flows: Flow[] = [
      { phase: 0.0, speed: 0.55, amp: 0.22, freq: 3.2, y: 0.58, alpha: 0.85, width: 2.0 },
      { phase: 1.7, speed: 0.38, amp: 0.16, freq: 5.1, y: 0.68, alpha: 0.55, width: 1.6 },
      { phase: 3.4, speed: 0.72, amp: 0.09, freq: 7.8, y: 0.78, alpha: 0.35, width: 1.2 },
    ];

    const candles: Candle[] = Array.from({ length: 42 }, (_, i) => ({
      i,
      up: Math.random() > 0.45,
      h: 8 + Math.random() * 30,
      life: Math.random(),
    }));

    const nodes: Node[] = Array.from({ length: 14 }, () => ({
      x: Math.random(),
      y: Math.random() * 0.9,
      vx: (Math.random() - 0.5) * 0.00022,
      vy: (Math.random() - 0.5) * 0.00016,
      pulse: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      const rect = host.getBoundingClientRect();
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, Math.floor(rect.width));
      H = Math.max(1, Math.floor(rect.height));
      bg.width = W * DPR;
      bg.height = H * DPR;
      fx.width = W * DPR;
      fx.height = H * DPR;
      bg.style.width = fx.style.width = `${W}px`;
      bg.style.height = fx.style.height = `${H}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      if (gl) gl.viewport(0, 0, bg.width, bg.height);
    };

    const onPointer = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      mouse.tx = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      mouse.ty = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
    };

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();
    window.addEventListener("pointermove", onPointer, { passive: true });

    const t0 = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      const t = (now - t0) / 1000;

      // ease mouse
      mouse.x += (mouse.tx - mouse.x) * (reduceMotion ? 0.02 : 0.06);
      mouse.y += (mouse.ty - mouse.y) * (reduceMotion ? 0.02 : 0.06);

      if (ready && gl && program) {
        gl.useProgram(program);
        if (uRes) gl.uniform2f(uRes, bg.width, bg.height);
        if (uTime) gl.uniform1f(uTime, t);
        if (uMouse) gl.uniform2f(uMouse, mouse.x, 1.0 - mouse.y);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }

      ctx.clearRect(0, 0, W, H);

      // scan beam
      const beamY = ((t * 0.05) % 1) * H;
      const beamGrad = ctx.createLinearGradient(0, beamY - 40, 0, beamY + 40);
      beamGrad.addColorStop(0, "rgba(216,182,90,0)");
      beamGrad.addColorStop(0.5, "rgba(216,182,90,0.08)");
      beamGrad.addColorStop(1, "rgba(216,182,90,0)");
      ctx.fillStyle = beamGrad;
      ctx.fillRect(0, beamY - 40, W, 80);

      // liquidity mesh
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > 1) n.vx *= -1;
        if (n.y < 0 || n.y > 0.9) n.vy *= -1;
        n.pulse += 0.02;
      });
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = (a.x - b.x) * W;
          const dy = (a.y - b.y) * H;
          const d = Math.hypot(dx, dy);
          if (d < 240) {
            const alpha = (1 - d / 240) * 0.13;
            ctx.strokeStyle = `rgba(216,182,90,${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x * W, a.y * H);
            ctx.lineTo(b.x * W, b.y * H);
            ctx.stroke();
          }
        }
      }
      nodes.forEach((n) => {
        const p = 0.6 + 0.4 * Math.sin(n.pulse);
        ctx.fillStyle = `rgba(216,182,90,${0.32 * p})`;
        ctx.beginPath();
        ctx.arc(n.x * W, n.y * H, 2 + p * 1.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(244,217,122,${0.16 * p})`;
        ctx.beginPath();
        ctx.arc(n.x * W, n.y * H, 7 + p * 3.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // flow lines
      flows.forEach((f) => {
        ctx.save();
        ctx.beginPath();
        const steps = 110;
        const mouseShift = (mouse.x - 0.5) * 40;
        const mouseAmp = 1 + (mouse.y - 0.5) * 0.9;
        for (let i = 0; i <= steps; i++) {
          const u = i / steps;
          const x = u * W + mouseShift * Math.sin(u * Math.PI);
          const y =
            H * f.y +
            Math.sin(u * f.freq * Math.PI + t * f.speed + f.phase) * 80 * f.amp * mouseAmp +
            Math.sin(u * f.freq * 1.8 * Math.PI + t * f.speed * 0.6) * 30 * f.amp;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(216,182,90,${f.alpha})`;
        ctx.lineWidth = f.width;
        ctx.lineCap = "round";
        ctx.shadowColor = "rgba(244,217,122,0.55)";
        ctx.shadowBlur = 14;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = `rgba(244,217,122,${f.alpha * 0.55})`;
        ctx.lineWidth = f.width * 0.5;
        ctx.stroke();
        ctx.restore();
      });

      // candles
      const cW = 7;
      const cGap = 4;
      const cBase = W - 30;
      const cTotal = candles.length * (cW + cGap);
      const cStart = cBase - cTotal;
      candles.forEach((c, i) => {
        c.life += 0.006;
        if (c.life > 1) {
          c.life = 0;
          c.up = Math.random() > 0.48;
          c.h = 10 + Math.random() * 32;
        }
        const x = cStart + i * (cW + cGap);
        const midY = H - 70;
        const top = midY - c.h / 2;
        const bot = midY + c.h / 2;
        const fade = Math.min(1, c.life * 2.2) * (1 - Math.max(0, c.life - 0.85) * 6);
        ctx.strokeStyle = `rgba(216,182,90,${0.32 * fade})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + cW / 2, top - 6);
        ctx.lineTo(x + cW / 2, bot + 6);
        ctx.stroke();
        if (c.up) {
          ctx.fillStyle = `rgba(216,182,90,${0.62 * fade})`;
          ctx.fillRect(x, top, cW, c.h);
        } else {
          ctx.strokeStyle = `rgba(166,136,59,${0.8 * fade})`;
          ctx.lineWidth = 1.2;
          ctx.strokeRect(x + 0.5, top + 0.5, cW - 1, c.h - 1);
        }
      });

      // particles
      particles.forEach((p) => {
        p.y -= p.vy * p.z;
        p.x += p.vx + (mouse.x - 0.5) * 0.0002 * p.z;
        if (p.y < -0.02) {
          p.y = 1.02;
          p.x = Math.random();
        }
        if (p.x < -0.02) p.x = 1.02;
        if (p.x > 1.02) p.x = -0.02;
        const r = p.r * p.z;
        ctx.fillStyle = `rgba(216,182,90,${p.a * p.z})`;
        ctx.beginPath();
        ctx.arc(p.x * W, p.y * H, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(244,217,122,${p.a * p.z * 0.35})`;
        ctx.beginPath();
        ctx.arc(p.x * W, p.y * H, r * 3.2, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  const hostClass = variant === "global" ? "mi-site-shader" : "mi-trading-shader";
  return (
    <div ref={hostRef} className={hostClass} aria-hidden="true">
      <canvas ref={bgRef} className="mi-trading-shader-bg" />
      <canvas ref={fxRef} className="mi-trading-shader-fx" />
    </div>
  );
}
