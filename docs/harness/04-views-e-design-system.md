# 04 · Views e design system

> Base: `AGENTS.md` (seção "Design System") e a skill `.agents/skills/barber-design-system/SKILL.md`.

## Ordem de leitura antes de qualquer UI

1. `design-system/02-tokens.md` — fonte de verdade dos valores.
2. `design-system/03-fundamentos.md` — cor, tipografia, espaçamento, ícone, elevação e movimento.
3. `design-system/04-componentes/<nome>.md` — especificação do componente (anatomia, variantes, estados).
4. `design-system/01-principios.md` e `design-system/06-acessibilidade.md` — restrições que decidem o resultado.

## Regras

- Estilos **só** com tokens do `src/view/theme.ts`. Nada de valores literais.
- Não invente valores nem trate `TODO` como pronto: registre a lacuna e peça esclarecimento.
- Acessibilidade: contraste mínimo 4,5:1, alvo de toque ≥ 48 dp, `accessibilityLabel` e `accessibilityRole` corretos.
- Componentes reutilizáveis vivem em `src/view/components/` — nunca dentro de `src/app/`.
- Cubra os estados: padrão, pressionado, foco e desabilitado.

## Mapa: `design-system/04-componentes/` → `src/view/components/`

| Especificação | Arquivo de código |
|---|---|
| `_modelo-componente.md` | template — não gera arquivo |
| `avatar.md` | `avatar.tsx` |
| `badge.md` | `badge.tsx` |
| `barra-busca.md` | `search-bar.tsx` |
| `botao.md` | `button.tsx` |
| `calendario.md` | `calendar.tsx` |
| `campo-de-texto.md` | `text-field.tsx` |
| `card.md` | `card.tsx` |
| `chips.md` | `chips.tsx` |
| `fab.md` | `fab.tsx` |
| `lista.md` | `list.tsx` |
| `switch.md` | `switch.tsx` |
| `tab-bar.md` | `tab-bar.tsx` |
| `tabs.md` | `tabs.tsx` |
| `top-app-bar.md` | `top-app-bar.tsx` |
| `upload-imagem.md` | `image-upload.tsx` |
