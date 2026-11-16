# Fundamentos

<!-- Regras de USO dos tokens (os valores ficam em 02-tokens.md). Frases curtas, no imperativo, verificáveis. -->

## Cor

- Utilize `color.action` somente para destacar a ação principal da tela. (Adaptado)
- Utilize `color.secondary` para ações secundárias e elementos de apoio. (Adaptado)
- Utilize `color.surface` como fundo principal das telas. (Herdado)
- Utilize `color.surface-container` para cards, painéis e agrupamentos de conteúdo. (Adaptado)
- Utilize `color.on-surface` para textos principais e `color.on-surface-variant` para informações secundárias. (Adaptado)
- Utilize `color.error` para erros, alertas críticos e ações destrutivas. (Herdado)
- Nunca utilize cores como única forma de comunicar um estado. Acrescente texto ou ícone. (Herdado)
- Mantenha contraste mínimo de 4,5:1 para textos comuns. (Herdado)
- Preserve a identidade castanha nos modos claro e escuro. (Adaptado)

## Tipografia

- Utilize `font.title` para títulos de tela e `font.subtitle` para subtítulos. (Herdado)
- Utilize `font.body` para textos corridos e `font.caption` para informações auxiliares. (Herdado)
- Utilize `font.label` para rótulos de botões e campos. (Herdado)
- Utilize exclusivamente a família Roboto. (Herdado)
- Respeite a escala de fonte configurada pelo usuário no Android. (Herdado)
- Permita a ampliação dos textos sem cortar informações ou sobrepor componentes. (Herdado)
- Evite utilizar muitos tamanhos e pesos tipográficos na mesma tela. (Adaptado)

## Espaçamento

- Utilize múltiplos de 8 dp como padrão e múltiplos de 4 dp para ajustes finos. (Herdado)
- Utilize `space.md` como margem lateral padrão das telas. (Adaptado)
- Utilize `space.sm` entre elementos relacionados. (Herdado)
- Utilize `space.lg` para separar grupos de informações. (Herdado)
- Utilize `space.xl` para separar seções independentes. (Herdado)
- Mantenha espaçamentos consistentes entre componentes equivalentes. (Herdado)
- Evite ajustar margens individualmente sem necessidade. (Adaptado)

## Ícones

- Utilize Material Symbols como conjunto oficial de ícones. (Herdado)
- Utilize ícones de 24 dp como tamanho padrão. (Herdado)
- Utilize ícones de 20 dp para elementos compactos e de 32 dp para destaques. (Adaptado)
- Utilize ícones preenchidos para indicar seleção ou estado ativo quando houver correspondência no conjunto adotado. (Herdado)
- Utilize rótulos textuais em ações cuja finalidade não seja imediatamente reconhecível. (Herdado)
- Forneça descrição acessível para ícones informativos e rótulos para ícones interativos. (Herdado)
- Oculte ícones puramente decorativos dos leitores de tela. (Herdado)
- Evite misturar bibliotecas de ícones diferentes. (Adaptado)

## Elevação

- Utilize `elevation.card` para cards que precisam se destacar da superfície. (Herdado)
- Utilize `elevation.dialog` para diálogos e elementos temporários sobrepostos. (Herdado)
- Utilize contraste de cor ou bordas para separar elementos que não precisam de elevação. (Adaptado)
- Preserve a hierarquia visual entre superfície, cards e diálogos. (Herdado)
- Evite sombras excessivas e elevação em elementos que não representam camadas independentes. (Adaptado)

## Movimento

- Utilize `motion.duration.short` para feedback de toque e pequenas mudanças de estado. (Herdado)
- Utilize `motion.duration.medium` para transições entre telas e mudanças de contexto. (Adaptado)
- Utilize `motion.duration.long` para abertura de diálogos e painéis. (Adaptado)
- Utilize `motion.easing.standard` como curva padrão das animações. (Herdado)
- Utilize `motion.easing.decelerate` para a entrada de elementos na interface. (Herdado)
- Respeite a configuração de redução de movimento do Android. (Herdado)
- Remova animações não essenciais quando a opção de redução de movimento estiver ativa. (Adaptado)
- Utilize animações somente quando ajudarem a indicar uma mudança de estado, fornecer feedback ou orientar a navegação. (Herdado)
- Evite animações contínuas, excessivas ou que atrasem o acesso às funcionalidades. (Adaptado)

## Responsividade e plataforma

- Utilize unidades dp para dimensões e espaçamentos no React Native. (Herdado)
- Utilize `SafeAreaView` para respeitar as áreas seguras do dispositivo. (Herdado)
- Mantenha os componentes adaptáveis a diferentes tamanhos de tela. (Herdado)
- Preserve os comportamentos de navegação esperados do Android. (Herdado)
- Utilize alvos de toque de pelo menos 48 dp para elementos interativos. (Herdado)
- Evite posicionamentos fixos que provoquem cortes em telas menores ou com texto ampliado. (Adaptado)