---
name: revisar-arquitetura
description: Roda o verificador de arquitetura e corrige as violações de dentro para fora. Use quando o usuário pedir para revisar ou corrigir a arquitetura do projeto.
---

# Revisar arquitetura

1. Rode o verificador com `npm run check`.
2. Agrupe as violações por regra.
3. Corrija **de dentro para fora**: `model` → `usecase` → `infra` → `di` → `viewmodel` → `view` → `app`.
4. Siga as convenções de `docs/harness/02-convencoes-de-codigo.md` (`@/`, sem `any`, entidade `type`, contrato `interface` com prefixo `i`, etc.).
5. **Nunca** altere o verificador, o `AGENTS.md` ou o design system para fazer um erro sumir.
6. Rode `npm run check` novamente e corrija tudo até passar.
