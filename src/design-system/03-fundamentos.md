# Fundamentos

<!-- Regras de USO dos tokens (os valores ficam em 02-tokens.md). Frases curtas, no imperativo, verificáveis. -->

## Cor

- Use `color.primary` somente para destacar a ação principal da tela (substituindo o termo legado `color.action`). (Adaptado)
- Nunca use cor como única forma de comunicar um estado. Acrescente texto, ícone ou outro indicador visual. (Herdado)
- Use os tokens semânticos de cor definidos em `02-tokens.md`, sem aplicar valores hexadecimais diretamente nos componentes. (Novo)
- Garanta contraste adequado nos temas claro e escuro antes de considerar a paleta validada. (Adaptado)

## Tipografia

- Use `font.headline-small` ou `font.title-large` para títulos de tela e seções, e `font.body-large` ou `font.body-medium` para textos corridos (substituindo os termos legados `font.title` e `font.body`). (Adaptado)
- Respeite o tamanho de fonte escolhido pelo usuário no sistema, considerando Dynamic Type no iOS e a escala de fonte no Android. (Herdado)
- Use os estilos tipográficos definidos em `02-tokens.md` e evite criar tamanhos isolados sem necessidade. (Adaptado)
- Destaque informações essenciais do agendamento, como serviço, profissional, data, horário e preço, sem depender somente da cor. (Novo)

## Espaçamento

- Use múltiplos de 8 dp para margens, alturas e espaçamentos, ou múltiplos de 4 dp para ajustes finos. (Herdado)
- Use `space.md` como margem lateral padrão das telas. (Adaptado)
- Use os tokens de espaçamento de `02-tokens.md` de forma consistente entre telas e componentes. (Adaptado)
- Preserve espaço suficiente entre horários, botões e controles para facilitar a interação por toque. (Novo)

## Ícones

- Use Material Symbols como conjunto de ícones padrão do aplicativo, mantendo consistência de estilo e tamanho. (Novo)
- Prefira ícones de 24 dp em botões e ações comuns, salvo quando a especificação do componente indicar outro tamanho. (Adaptado)
- Adicione um rótulo acessível aos botões que contenham somente ícones. (Herdado)
- Use ícones acompanhados de texto quando o significado ou a ação não forem evidentes. (Adaptado)

## Elevação

- Use `elevation.card` para destacar cards que precisem se separar visualmente do fundo. (Adaptado)
- Prefira contraste de superfície ou bordas quando a elevação não acrescentar hierarquia visual. (Novo)
- Reserve elevações maiores para elementos que apareçam acima do conteúdo, como menus e diálogos, conforme a escala definida em `02-tokens.md`. (Adaptado)
- Evite usar sombras diferentes sem uma necessidade funcional clara. (Novo)

## Movimento

- Use animações curtas para confirmar ações, indicar mudanças de estado ou acompanhar transições entre contextos. (Adaptado)
- Evite animações decorativas frequentes, movimentos que distraiam e transições que atrasem o agendamento. (Novo)
- Respeite a opção de reduzir movimento do sistema, mantendo as informações e funcionalidades disponíveis. (Herdado)
- Não use animações como única forma de comunicar carregamento, sucesso, erro ou indisponibilidade de horários. (Novo)
