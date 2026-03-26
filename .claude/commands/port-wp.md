# Portar Componente: WordPress PHP → React

Porta un componente del WordPress original al nuevo stack Next.js.

**Argumentos:** `$ARGUMENTS` — ejemplo: `HeroSection` o `calcPS PositionSizeCalc`

## Instrucciones

1. Busca el componente en `.claude/memory/wp-line-reference.md` para obtener las líneas exactas

2. Lee el código fuente en:
   `/Users/yoan/Documents/Code/MINE/marcinvestments/wp-content/themes/blocksy-child/functions.php`
   (líneas según la referencia)

3. Analiza:
   - HTML generado (lo que el PHP hace `echo`)
   - Clases CSS usadas (verificar que existen en `globals.css` o `design-system.css`)
   - JavaScript inline (convertir a React hooks/estado)
   - URLs de imágenes `/wp-content/uploads/` → `/images/` en `public/`

4. Crea el componente React equivalente:
   - Misma estructura visual
   - Mismas interacciones JavaScript → React state/hooks
   - Mismas clases CSS `mi-*` (ya están portadas en `globals.css`)
   - TypeScript estricto

5. Verifica que el output visual sea **idéntico** al original:
   - Mismos textos
   - Mismo comportamiento responsive
   - Mismas animaciones

6. Actualiza `.claude/memory/component-registry.md`

## Checklist de portado
- [ ] HTML estructura idéntica
- [ ] Clases CSS `mi-*` preservadas
- [ ] JavaScript convertido a React hooks
- [ ] Imágenes de `/wp-content/uploads/` referenciadas en `/public/images/`
- [ ] Responsive 768px y 1024px funcionando
- [ ] Sin `any` en TypeScript
