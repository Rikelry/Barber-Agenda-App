# Teste com IA

<!-- Objetivo: provar que o sistema é AI friendly. Quem erra é o texto, não a IA: cada desvio mostra uma regra ausente ou ambígua. -->

## Rodada 1

- **Ferramenta e modelo:** TODO
- **Material entregue à IA:** somente os arquivos de `design-system/`
- **Prompt usado:**

> TODO: cole aqui o prompt (ex.: "Crie a tela X do app usando exclusivamente o sistema de design fornecido.")

- **Resultado:** TODO (imagem ou trecho de código)

| Verificação | Passou? | Observação |
| --- | --- | --- |
| Cores, espaços e raios vieram de tokens | TODO | TODO |
| Todos os estados dos componentes foram respeitados | TODO | TODO |
| Alvos de toque e contraste respeitados | TODO | TODO |
| A IA não inventou valores | TODO | TODO |

## Desvios e correções na documentação

| Desvio | Causa (o que faltava ou estava ambíguo) | Arquivo corrigido |
| --- | --- | --- |
| TODO | TODO | TODO |

## Rodada 2 (após as correções)

TODO: repita o teste uma vez e registre o resultado e o que mudou.

## Rodada 3: harness MVVM (teste de login)

- **Ferramenta e modelo:** Trae (modelo não registrado)
- **Material entregue à IA:** AGENTS.md, docs/harness/, design-system/ e as
  receitas em .agents/skills/
- **Prompt usado:**

> Não registrado. O login foi gerado como teste informal, antes de definirmos o
> registro dos prompts. Na próxima rodada o prompt será copiado para este arquivo.

- **Resultado:** vertical de login completa (view, viewmodel, usecase, model,
  infra, di), 17 arquivos em src/. Telas e componentes: index, button e
  text-field.

| Verificação | Passou? | Observação |
| --- | --- | --- |
| Rota fina e espelho app/view | Passou | src/app/index.tsx importa @/view/index |
| Cores e espaços vieram de tokens | Passou | o verificador não acusou STYLE; o tema ainda tem papéis de cor provisórios a conferir contra 02-tokens.md |
| Camadas e imports respeitados | Passou | sem erro de import entre camadas |
| Lugar e nome dos arquivos (Use Case, camelCase) | Não passou | o verificador não acusou na primeira rodada; acusou 4 arquivos depois das regras novas |
| tsc --noEmit | Passou | sem erros |

### Desvios e correções no harness

| Desvio | Causa (o que faltava) | Arquivo corrigido |
| --- | --- | --- |
| iLoginUseCases.ts em model/services/ | o verificador não checava o lugar | scripts/check-arquitetura.mjs (USECASE-LUGAR) |
| loginUseCase.ts no singular | o verificador não checava o nome | scripts/check-arquitetura.mjs (USECASE-NOME) |
| text-field.tsx e auth-session.ts em kebab-case | convenção sem verificação, e o doc 04 mostrava kebab-case | scripts/check-arquitetura.mjs (NOME-CAMELCASE) e docs/harness/04 |
| Skill de UI verificava com npx expo lint e tsc | desalinhada com o harness | .agents/skills/barber-design-system/SKILL.md |

### Pendências
- O código do login continua sem corrigir (renomear e mover os 4 arquivos),
  por ser só um teste.
- Repetir o teste depois das regras novas, anotando modelo e prompt, e
  registrar o resultado.

