// Fase 1: Home completa se construye en src/components/home/
// Por ahora: placeholder de desarrollo que confirma que el stack funciona

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center">
        <span className="mi-badge">En construcción</span>
        <h1 className="mi-section-title mt-4">
          Investments <span className="mi-text-gradient">Marc</span>
        </h1>
        <p className="text-mi-text-secondary text-lg max-w-md mx-auto">
          Stack: Next.js 16 + Tailwind 4 + Firebase
        </p>
        <div className="mt-8 flex gap-4 justify-center flex-wrap">
          {["Design System ✓", "Inter Font ✓", "Tailwind 4 ✓", "App Router ✓"].map((item) => (
            <span
              key={item}
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: "var(--mi-bg-secondary)", border: "1px solid var(--mi-border)", color: "var(--mi-gold-light)" }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
