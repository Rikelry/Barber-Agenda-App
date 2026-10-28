# Changelog

Versões no formato `MAIOR.MENOR.CORREÇÃO`. Mudança grande = versão nova (ex.: 2.4.1 → 3.0.0).

## 0.1.0 · 21/10/26

- Primeira versão do sistema, apresentada na aula de 21/10.
- **Responsáveis:** TODO
- **Mudanças:** TODO
- Ajustes feitos após o teste com IA: TODO

## 0.1.1 · 26/10/26

- Atualização do sistema de design apresentado na aula de 21/10.
- **Responsáveis:** @Rikelry
- **Mudanças:** Reformulação das cores primarias do app e reajuste para o Material Design 3 Expressive
- Ajustes feitos manualmete: Reajuste das cores primarias

## 0.1.2 · 28/10/26

- Auditoria e padronização completa de tokens, cores e acessibilidade.
- **Responsáveis:** @Rikelry e assistente de IA
- **Mudanças:**
  - Padronização canônica da nomenclatura de tokens em todos os documentos (substituição dos legados `color.action`/`color.on-action` por `color.primary`/`color.on-primary` e alinhamento dos tokens tipográficos com a escala M3).
  - Recuperação das 5 cores originais de marca da equipe (`orange-500` `#FF8500`, `amber-700` `#CC7D29`, `ochre-700` `#996D3D`, `brown-700` `#66523D`, `brown-900` `#332E29`) como valores primitivos documentados.
  - Distinção explícita entre primitivos brutos de curvatura (`radius-0` a `radius-full`) e papéis semânticos (`radius.none` a `radius.full`), adicionando `field.radius` e `card.radius` aos tokens de componente.
  - Correção da tabela de acessibilidade (`06-acessibilidade.md`) com cálculo reproduzível de luminância e contraste conforme WCAG 2.2 AA, diferenciando requisitos documentados de testes pendentes de homologação em dispositivos reais.
  - Validação e correção do exemplo JSON parcial (W3C DTCG) e eliminação de links quebrados em fluxos (`05-padroes.md`).
