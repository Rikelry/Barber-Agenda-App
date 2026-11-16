# Princípios

<!-- Camada 1 da aula: o porquê das decisões. De 3 a 5 princípios.
     Exemplos do sistema base: Material ("o material é a metáfora", "ousado e intencional", "movimento dá significado");
     HIG ("hierarquia", "harmonia", "consistência"); Fluent 2 ("natural em cada plataforma", "feito para o foco", "um por todos"). -->

## Princípio 1: Simplicidade e clareza

- **Origem:** Adaptado. Inspirado nas diretrizes do Material Design 3 de criar interfaces claras, intencionais e centradas nas necessidades dos usuários.
- **O porquê:** Facilitar a busca por barbearias, a consulta de serviços e a realização de agendamentos, reduzindo dúvidas e etapas desnecessárias.
- **Na prática:** Organizar as informações em seções claras, utilizar textos objetivos, destacar a ação principal de cada tela e dividir o agendamento em etapas compreensíveis. Utilizar títulos, botões e campos de texto com funções bem definidas.
- **Evite:** Excesso de informações, textos desnecessários, formulários longos sem necessidade e várias ações principais competindo pela atenção.

## Princípio 2: Consistência visual

- **Origem:** Adaptado. Inspirado nas diretrizes de consistência e uso de padrões reconhecíveis do Material Design 3.
- **O porquê:** Permitir que os usuários reconheçam os componentes e compreendam seu funcionamento em diferentes telas, reduzindo o esforço de aprendizagem e tornando a navegação previsível.
- **Na prática:** Manter padrões consistentes de cores, tipografia, espaçamentos, botões, campos de texto, ícones e navegação. Centralizar os valores visuais em tokens e reutilizar os componentes documentados em `04-componentes/`.
- **Evite:** Utilizar estilos diferentes para componentes que desempenham a mesma função sem justificativa, definir valores visuais arbitrários ou alterar padrões de navegação entre telas equivalentes.

## Princípio 3: Acessibilidade e legibilidade

- **Origem:** Adaptado. Baseado nas diretrizes de acessibilidade do Material Design 3, complementadas pelos requisitos de acessibilidade do Android.
- **O porquê:** Tornar as informações e funcionalidades mais fáceis de perceber, compreender e utilizar por pessoas com diferentes capacidades visuais, motoras e cognitivas.
- **Na prática:** Utilizar contraste mínimo de 4,5:1 para texto comum, textos legíveis, rótulos acessíveis, alvos de toque adequados, suporte ao aumento de fonte e compatibilidade com leitores de tela. Não depender exclusivamente de cores para comunicar estados.
- **Evite:** Textos pequenos ou com baixo contraste, botões difíceis de tocar, campos identificados somente por ícones sem rótulos acessíveis e informações transmitidas apenas por cores.

## Princípio 4: Confiança e transparência

- **Origem:** Novo. Princípio específico do Barber Agenda, definido a partir das necessidades dos usuários ao consultar serviços e realizar agendamentos.
- **O porquê:** Ajudar os usuários a tomar decisões conscientes ao escolher serviços e realizar agendamentos, deixando claras as informações e o resultado de cada ação.
- **Na prática:** Apresentar claramente o serviço, o profissional, a data, o horário e o preço antes da confirmação, quando disponível. Exibir mensagens de sucesso ou erro após as operações e indicar os estados dos agendamentos de maneira compreensível.
- **Evite:** Ocultar informações importantes, apresentar preços ambíguos, indicar horários indisponíveis como livres ou deixar o usuário sem retorno após uma ação.
