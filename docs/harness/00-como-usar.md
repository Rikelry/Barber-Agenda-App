# 00 · Como usar o harness

> Guia curto de uso do harness nas duas ferramentas do grupo: Claude Code e Trae.

## Regras

- O `AGENTS.md` é a fonte única das regras.
- O Claude Code lê pelo `CLAUDE.md` (que contém `@AGENTS.md`).
- O Trae lê pelo `.trae/rules/project_rules.md`.
- Nunca duplicar regras nesses dois arquivos.

## Verificação

- **Claude Code:** os ganchos de `.claude/settings.json` rodam o verificador sozinhos — `--hook` após cada edição e `--stop` antes de encerrar.
- **Trae:** não há ganchos; rodar `npm run check` ao final de cada tarefa.

## Receitas

- Ficam em `.agents/skills/`.
- Em qualquer ferramenta, pedir assim: "Siga a receita `.agents/skills/<nome>/SKILL.md`. Tarefa: `<tarefa>`".
- As receitas são: `nova-tela`, `nova-funcionalidade`, `sincronizar-tema`, `revisar-arquitetura`.

## Regra de equipe

- Quando a IA errar, não corrija só o código: corrija o harness (AGENTS.md, docs, receitas ou verificador) e faça commit.

## Aviso

- Mudou uma receita? Ela só existe em `.agents/skills/`; não copiar para outro lugar.
