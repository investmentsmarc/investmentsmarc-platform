# Scaffold: Nuevo Componente

Crea un componente React siguiendo el design system de Investments Marc.

**Argumentos:** `$ARGUMENTS` — ejemplo: `GoldButton ui` o `HeroSection home Server`

## Instrucciones

1. Parsea `$ARGUMENTS`:
   - Argumento 1: nombre del componente (PascalCase)
   - Argumento 2: carpeta destino (`global` | `ui` | `home` | `about` | `calculators` | `blog` | `forms`)
   - Argumento 3 (opcional): `Server` o `Client` (default: `Client`)

2. Crea `src/components/{carpeta}/{Nombre}.tsx` con:
   - Directiva `'use client'` si es Client component
   - Props tipadas con TypeScript (sin `any`)
   - Import de `@/styles/design-system.css` si usa glassmorphism/glow
   - Clases CSS usando variables `--mi-*` o utilities de Tailwind mapeadas
   - Responsive en 768px y 1024px

3. Exporta el componente como **named export** Y default export

4. Actualiza `.claude/memory/component-registry.md` — cambia el estado de 🔲 a ✅

5. Muestra el componente creado y un ejemplo de uso

## Template base (Client)
```tsx
'use client';

interface {Name}Props {
  // props aquí
}

export function {Name}({ ...props }: {Name}Props) {
  return (
    <div className="mi-section">
      {/* implementación */}
    </div>
  );
}

export default {Name};
```
