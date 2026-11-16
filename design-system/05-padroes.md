# Padrões

<!-- Camada 4 da aula: fluxos. Mínimo de 2 padrões do app (login, busca, formulário, lista com detalhe, etc.). -->

## Padrão 1: Autenticação e acesso

- **Objetivo do usuário:** Acessar o aplicativo ou criar uma conta para utilizar os serviços do Barber Agenda.
- **Componentes usados:** Campo de texto (`input.bg`, `input.label`, `input.border`), botão (`button.bg`, `button.label`), texto auxiliar (`font.body`, `font.caption`) e indicador de carregamento (`color.action`).

- **Passos:**
  1. O usuário abre o aplicativo e visualiza a tela de acesso.
  2. Informa e-mail e senha nos campos correspondentes.
  3. Seleciona o botão de entrar.
  4. O sistema valida os dados e realiza a autenticação pela API.
  5. Em caso de sucesso, direciona o usuário à área correspondente ao seu perfil: cliente, profissional ou proprietário.
  6. Caso não possua conta, pode acessar a opção de cadastro e preencher os dados solicitados.

- **Estados que precisam de tela:**

| Situação | O que o usuário vê | Componentes e tokens |
| --- | --- | --- |
| Carregando | Indicador de progresso e botão temporariamente desabilitado durante a autenticação. | `button.bg-disabled`, `color.action`, `font.body` |
| Erro | Mensagem informando credenciais inválidas, falha de conexão ou campos obrigatórios não preenchidos. | `color.error`, `input.error`, `font.caption` |
| Vazio | Campos de e-mail e senha vazios, com orientações para preenchimento. | `input.bg`, `input.label`, `input.border` |
| Sucesso | Confirmação do acesso e redirecionamento para a área correspondente ao perfil. | `color.action`, `color.on-action`, `font.body` |

- **Faça:** Utilize rótulos claros, valide os campos e informe especificamente os erros encontrados. Preserve os dados já preenchidos quando ocorrer uma falha.
- **Evite:** Exibir mensagens genéricas, apagar todos os campos após um erro ou permitir múltiplos envios durante o carregamento.

## Padrão 2: Agendamento de serviços

- **Objetivo do usuário:** Encontrar uma barbearia, escolher um serviço e profissional, selecionar um horário disponível e confirmar um agendamento.
- **Componentes usados:** Campo de busca (`input.bg`, `input.label`), cards de barbearia e serviço (`card.bg`, `card.radius`, `card.elevation`), lista de profissionais, seletor de data e horário, botão (`button.bg`, `button.label`) e mensagens de estado (`color.error`, `font.body`, `font.caption`).

- **Passos:**
  1. O cliente acessa a área de agendamentos.
  2. Pesquisa ou seleciona uma barbearia disponível.
  3. Visualiza os serviços oferecidos, incluindo descrição, duração e preço.
  4. Escolhe o serviço desejado.
  5. Seleciona um profissional disponível ou utiliza a opção de escolha automática, caso oferecida pela barbearia.
  6. Escolhe uma data e consulta os horários disponíveis.
  7. Seleciona um horário e revisa os dados do agendamento.
  8. Confirma a solicitação.
  9. O sistema verifica a disponibilidade pela API e registra o agendamento.
  10. O cliente visualiza a confirmação com os detalhes do serviço, profissional, data e horário.

- **Estados que precisam de tela:**

| Situação | O que o usuário vê | Componentes e tokens |
| --- | --- | --- |
| Carregando | Indicador de progresso enquanto barbearias, serviços ou horários são consultados. | `color.action`, `font.body`, `card.bg` |
| Erro | Mensagem informando falha na consulta, indisponibilidade do horário ou erro ao confirmar o agendamento. | `color.error`, `font.caption`, `button.bg` |
| Vazio | Mensagem informando que nenhuma barbearia, serviço ou horário está disponível para os filtros selecionados. | `color.on-surface-variant`, `font.body`, `font.caption` |
| Sucesso | Confirmação do agendamento com identificação da barbearia, serviço, profissional, data e horário. | `color.action`, `color.on-action`, `card.bg`, `font.body` |

- **Faça:** Apresente as informações essenciais antes da confirmação. Atualize os horários conforme a disponibilidade retornada pela API e impeça a confirmação de horários indisponíveis.
- **Evite:** Permitir agendamentos duplicados, ocultar preços ou duração dos serviços e confirmar uma reserva antes da resposta positiva do servidor.

## Regras gerais dos padrões

- Utilize os mesmos componentes e tokens em todos os fluxos.
- Apresente feedback visual para toda ação iniciada pelo usuário.
- Preserve os dados preenchidos durante falhas recuperáveis.
- Diferencie claramente estados de carregamento, erro, vazio e sucesso.
- Utilize mensagens objetivas e compreensíveis.
- Respeite os alvos de toque mínimos de 48 dp.
- Adapte as cores semânticas automaticamente ao modo claro ou escuro.
- Nunca apresente um agendamento como confirmado antes da confirmação da API.