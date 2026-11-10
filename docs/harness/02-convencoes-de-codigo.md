# 02 · Convenções de código

> Base: `AGENTS.md` (seção "Arquitetura e organização do código") e `docs/architecture/mvvm-sofisticado.md`. Consulte lá para o texto completo.

## Nomenclatura

- Imports **sempre** com alias `@/`. Nunca `./` ou `../`.
- Entidades e demais tipos: `type` (não `interface`).
- Contratos: `interface` com prefixo `i` (`IBookingDataSource`), arquivo em camelCase (`iBookingDataSource.ts`).
- Arquivos: sempre camelCase (`button.tsx`, `booking.tsx`, `createBooking.ts`, `useBookingViewModel.ts`).
- Componentes exportados como **função nomeada** (nunca `export default function`).

## Proibições

- `any`.
- `React.FC`.
- `export default function`.
- `interface` para props (use `type`).
- Valores literais de cor, espaçamento ou raio — só tokens do `src/view/theme.ts`.
- Vocabulário: use **Entidade, DataSource, Service, Use Case**. Proibido `Repository`, "repositório" e `Connector`.

## Regras gerais

- Uma responsabilidade por arquivo; alterações pequenas e direcionadas.
- Sem `fetch`, `try/catch` de negócio ou acesso a dados na View.
- Erros técnicos convertidos em `DomainError` na infraestrutura.
- Não crie camadas/pastas sem necessidade real da funcionalidade.

## Verificação

- Rode `npm run check` ao concluir e corrija tudo.
- Nunca altere o verificador, o `AGENTS.md` ou o design system para esconder um erro.

Regras obrigatórias completas em `AGENTS.md`.
