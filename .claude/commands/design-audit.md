# Auditoría de Design System

Revisa un archivo o componente para detectar violaciones del design system.

**Argumentos:** `$ARGUMENTS` — ruta al archivo o componente, ejemplo: `src/components/home/HeroSection.tsx`

## Instrucciones

Lee el archivo indicado en `$ARGUMENTS` y audita:

### ❌ Busca Violaciones

1. **Colores hardcodeados** — cualquier hex `#...` o `rgb(...)` que NO sea una variable `--mi-*`
2. **Clases Tailwind de color** sin mapeo a `--mi-*` (ej: `bg-gray-900`, `text-white` en lugar de `text-mi-text-primary`)
3. **Breakpoints incorrectos** — cualquier breakpoint que no sea `768px` o `1024px`
4. **Fuentes hardcodeadas** — cualquier `font-family` que no use `var(--mi-font)`
5. **Shadows con color gold** — violación de la regla "shadows neutros, sin gold tint"
6. **`any` en TypeScript**
7. **Rutas relativas largas** (`../../`) en lugar de `@/`
8. **Efectos complejos en globals.css** en lugar de `design-system.css`
9. **`'use client'` innecesario** — si el componente no tiene hooks ni eventos

### ✅ Confirma que existe

1. Variables `--mi-*` para todos los colores
2. Prefijo `mi-` en clases custom
3. Responsive en ambos breakpoints
4. TypeScript types sin `any`
5. Server/Client component correctamente declarado

### Output

Presenta:
1. Lista de violaciones encontradas con línea exacta
2. Correcciones sugeridas con el código correcto
3. Score de conformidad: X/10 violaciones corregidas
