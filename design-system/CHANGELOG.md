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

## 0.2.0 · 12/11/26

- Fixação do esquema de cor a partir da marca.
- **Responsáveis:** @jose2gabriel
- **Mudanças:**
  - `brand.source.primary` confirmado como `orange-500` (`#FF8500`).
  - Papéis semânticos de cor (claro e escuro) gerados com `SchemeFidelity` do Material e aplicados em `src/view/theme.ts`, substituindo o roxo padrão do M3.
  - Contraste dos pares texto/fundo principais medido e registrado no `02-tokens.md` (todos acima de 4,5:1).
  - `color.focus` continua pendente de definição.

## 0.2.1 · 15/11/2026

- Primeira versão do sistema de design do **Barber Agenda**, baseada no Material Design 3 e adaptada à identidade visual do aplicativo.
- **Responsáveis:** Equipe de desenvolvimento do Barber Agenda.
- **Mudanças:**
  - Definição dos princípios de design e da identidade visual.
  - Criação de tokens de cores, tipografia, espaçamento, formas, elevação e movimento.
  - Documentação dos fundamentos visuais e das regras de uso.
  - Definição dos padrões de autenticação e agendamento de serviços.
  - Documentação dos critérios de acessibilidade, incluindo contraste, áreas de toque, foco e leitores de tela.
- **Ajustes feitos após o teste com IA:** Revisão da consistência entre os arquivos, padronização dos nomes dos tokens e verificação das combinações de contraste nos modos claro e escuro. Foram documentadas melhorias para manter a navegação simples, os feedbacks claros e os fluxos de agendamento confiáveis.

## 0.3.0 · 24/11/26

- Redesign da tela Início com nova paleta marrom, bege e creme.
- **Responsáveis:** @jose2gabriel e assistente de IA
- **Mudanças:**
  - Primitivos novos `brown-950`, `brown-800`, `brown-900`, `beige-100/200/300`, `cream-50`, `taupe-500` e `green-600`; o modo claro de `src/view/theme.ts` passa a usá-los em todo o app.
  - `green-600` vira o verde semântico de "Confirmado" (substitui o `#2E7D32` pendente).
  - Tokens novos `color.container`, `color.secondary-container`, `color.success` e de sobreposição (`overlay.scrim`, `overlay.status-tint`).
  - Barra inferior com fundo bege, cantos superiores arredondados e traço sob a aba ativa.
  - Conflitos de contraste do `taupe-500` e do texto verde registrados em `02-tokens.md`.
  - Cabeçalho do Início com arcos decorativos (`overlay.header-pattern`) e categorias com ilustrações SVG próprias (Cabelo, Barba, Combo, Sobrancelha), no lugar dos ícones genéricos.
  - Categorias do Início trocadas por chips em cápsula (Tudo, Cabelo, Barba, Combo, Sobrancelha), sem ícones; as ilustrações SVG das categorias foram removidas.
  - Detalhe da barbearia redesenhado: foto em largura total com informações sobre degradê, voltar sobre a foto, galeria de trabalhos, abas preenchidas (`Tabs` variante `filled`), cards de serviço com foto e cards de profissional com "Escolher". Token novo `overlay.control-scrim`.
  - Cabeçalho do Início com o nome do app ("Barber Agenda") no lugar de "Encontre seu estilo" e barra de busca que filtra as barbearias por nome ou endereço.
  - Logo do app (calendário com pente e tesoura, `assets/images/logo.svg`) aplicado ao ícone do app (Android adaptativo com fundo `#27100A`, iOS e web), à splash (fundo `cream-50`) e à marca do login (112 dp).
  - Agenda com pedidos de horário: status "Aguardando aprovação" e "Recusado", cards de solicitação com Aprovar/Recusar/Sugerir outro horário, agenda da barbearia para o dono e tela Remarcar (`design-system/04-componentes/agenda.md`).
  - Dono que também atende: card "Você também atende aqui?" na tela Profissionais; ao entrar na equipe ganha a aba Trabalho com a própria agenda e os pedidos dele.
  - Segmented button do Material 3 (`segmented-button.md`, tokens oficiais: 40 dp, pontas arredondadas, contorno de 1 dp, selecionado em `secondary-container` com ✓) em Próximos | Histórico, Serviços | Profissionais e Recorrente | Pontual; as variantes "segmentada" e "preenchida" das Tabs saíram.
  - Texto secundário (`color.on-surface-variant`) passa a `brown-700` `#79583F`, mais suave, com contraste acima de 4,5:1 nos fundos claros e bege.
  - Perfil reorganizado como central da conta (`perfil-menu.md`): Identificação, CONTA, TRABALHO e MINHA BARBEARIA por papel, com itens de duas linhas no estilo do menu da conta Google; saiu "Trocar senha"; Sair da conta com confirmação.
  - Editar e Nova barbearia: identificação com foto, nome e botão de câmera; seções INFORMAÇÕES GERAIS e ENDEREÇO; outlined text fields com rótulo flutuante do Material 3 (`floatingLabel`); Número ao lado do Complemento/Bairro e Cidade ao lado do Estado.
  - Aba Gestão do dono passa a ser a "Agenda e solicitações" da barbearia (chips para trocar entre barbearias); a lista "Minhas barbearias" saiu (edição pelo Perfil).
  - Aba do dono renomeada para "Trabalho" (ícone de relógio, igual à do barbeiro); o dono que também atende tem uma aba só, e os pedidos dele aparecem na agenda da barbearia.

## 0.4.0 · 27/11/26

- Aba Trabalho redesenhada (barbeiro e dono).
- **Responsáveis:** @jose2gabriel e assistente de IA
- **Mudanças:**
  - **Telas:** seletor compacto de barbearia (menu M3), calendário semanal com ponto nos dias com horários, solicitações do dia em cards compactos e agenda do dia em linha do tempo enxuta.
  - **Indicadores:** os quatro cards de indicadores saíram da tela.
  - **Componentes novos:** Bottom sheet (detalhes e sugerir outro horário), Dialog (recusar com motivo) e Snackbar (avisos das ações). As specs estão em `04-componentes/`.
  - **Status:** oito, sempre com texto (Pendente, Aguardando cliente, Confirmado, Em andamento, Concluído, Não compareceu, Recusado, Cancelado), com o token novo `color.pending` (`amber-200` com `amber-900`, 9,1:1).
  - **Tamanhos:** `componentSizes.agenda` (ponto do dia, coluna da hora, trilho, alça e limites do sheet).
  - **Telas removidas:** "Remarcar horário" e "Agenda da barbearia" (substituídas pelos bottom sheets da aba Trabalho).
