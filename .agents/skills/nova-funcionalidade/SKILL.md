---
name: nova-funcionalidade
description: Implementa uma funcionalidade nova de ponta a ponta no Barber Agenda (domínio, infra em memória, Use Case, container, teste e tela). Use quando o usuário pedir uma funcionalidade nova que envolva regras de negócio.
---

# Nova funcionalidade

1. Defina ou reutilize **entidades** (`type`) e **contratos** (`interface` com prefixo `i`) em `src/model/`.
2. Modele os erros de domínio em `src/model/errors.ts` (`DomainError`).
3. Implemente a regra de negócio no **Use Case** em `src/usecase/`, recebendo o contrato pelo construtor.
4. Implemente a **infraestrutura** em `src/infra/` (datasources/services, em memória quando não houver back-end), convertendo erros em `DomainError`.
5. Registre as dependências em `src/di/container.ts` — único ponto que importa `@/infra`.
6. Escreva o **teste** do Use Case (e da ViewModel quando houver), usando fakes.
7. Crie a **tela** seguindo a skill `.agents/skills/nova-tela/SKILL.md`.
8. Rode `npm run check` e corrija tudo até passar.
