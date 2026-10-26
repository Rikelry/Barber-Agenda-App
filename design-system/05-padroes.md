# Padrões

<!-- Camada 4 da aula: fluxos. Mínimo de 2 padrões do app (login, busca, formulário, lista com detalhe, etc.). -->

## Padrão 1: Autenticação (Login e Cadastro)

- **Objetivo do usuário:** Acessar sua conta pessoal ou criar uma nova para gerenciar agendamentos.
- **Componentes usados:** [Botão](04-componentes/botao.md), [Campo de Texto](04-componentes/campo-de-texto.md), Links de navegação.
- **Passos:**
  1. O usuário abre o app e visualiza a tela de Login.
  2. Insere e-mail e senha.
  3. Caso não tenha conta, navega para a tela de Cadastro.
  4. Preenche os dados solicitados (Nome, E-mail, Telefone e Senha).
  5. Confirma a criação da conta e é redirecionado para a Home.
- **Estados que precisam de tela:**

| Situação | O que o usuário vê | Componentes e tokens |
| --- | --- | --- |
| Carregando | Spinner de carregamento no botão ou sobreposição | `color.action` |
| Erro | Mensagem de erro abaixo dos campos ou Toast | `color.error`, `font.label` |
| Sucesso | Feedback visual momentâneo antes do redirecionamento | `color.action` |

- **Faça:** Forneça feedback claro caso a senha esteja incorreta ou o e-mail já exista.
- **Evite:** Formulários muito extensos em uma única tela; use feedback de validação em tempo real.

## Padrão 2: Agendamento de Serviço

- **Objetivo do usuário:** Encontrar uma barbearia, escolher um serviço e reservar um horário disponível.
- **Componentes usados:** [Card](04-componentes/card.md), [Botão](04-componentes/botao.md), Calendário de seleção, Chips de horários.
- **Passos:**
  1. O usuário busca uma barbearia na tela inicial ou na lista de barbearias.
  2. Seleciona a barbearia para ver os detalhes (serviços e profissionais).
  3. Escolhe o serviço e o profissional desejado.
  4. Seleciona a data no calendário e um dos horários disponíveis.
  5. Revisa as informações no resumo do agendamento e clica em "Confirmar Agendamento".
- **Estados que precisam de tela:**

| Situação | O que o usuário vê | Componentes e tokens |
| --- | --- | --- |
| Carregando | Esqueleto (Skeleton) da lista ou detalhes | `color.surface` adaptado |
| Erro | Mensagem informando que o horário não está mais disponível | `color.error` |
| Vazio | Mensagem informando que não há barbearias ou horários | `color.on-surface` (opacidade reduzida) |
| Sucesso | Tela ou Modal de confirmação com resumo do agendamento | `color.action`, `font.title` |

- **Faça:** Mostre claramente o preço e a duração do serviço antes da confirmação final.
- **Evite:** Permitir a seleção de datas passadas ou horários que já foram ocupados.

## Padrão 3: Recuperação de Senha

- **Objetivo do usuário:** Recuperar o acesso à conta caso tenha esquecido a senha.
- **Componentes usados:** [Campo de Texto](04-componentes/campo-de-texto.md), [Botão](04-componentes/botao.md).
- **Passos:**
  1. Na tela de Login, o usuário clica em "Esqueceu a senha?".
  2. Insere o e-mail cadastrado na tela de "Recuperar senha".
  3. Recebe um link ou código (simulado no fluxo de UI).
  4. Navega para a tela de "Redefinir senha".
  5. Insere a nova senha e confirma.
- **Estados que precisam de tela:**

| Situação | O que o usuário vê | Componentes e tokens |
| --- | --- | --- |
| Erro | E-mail não encontrado ou senhas não coincidem | `color.error` |
| Sucesso | Mensagem confirmando o envio do link ou a troca da senha | `color.action` |

## Padrão 4: Gestão de Perfil do Usuário

- **Objetivo do usuário:** Atualizar dados pessoais, trocar senha ou visualizar histórico de agendamentos.
- **Componentes usados:** [Avatar](04-componentes/avatar.md), [Campo de Texto](04-componentes/campo-de-texto.md), [Botão](04-componentes/botao.md).
- **Passos:**
  1. O usuário acessa a aba "Perfil" no menu inferior.
  2. Visualiza seus dados atuais (Nome, E-mail, Telefone).
  3. Edita as informações desejadas ou preenche os campos de "Trocar Senha".
  4. Clica em "Salvar alterações".
- **Faça:** Peça a senha atual para confirmar mudanças sensíveis como e-mail ou nova senha.

## Padrão 5: Gestão de Barbearia (Fluxo do Proprietário)

- **Objetivo do usuário:** Cadastrar, editar e gerenciar informações da sua barbearia (serviços, profissionais, horários).
- **Componentes usados:** [Lista](04-componentes/lista.md), [Card](04-componentes/card.md), [Botão Flutuante](04-componentes/fab.md).
- **Passos:**
  1. O proprietário acessa "Minhas Barbearias".
  2. Seleciona uma barbearia para editar ou clica no botão "+" para criar uma nova.
  3. Gerencia a lista de profissionais vinculados.
  4. Define os serviços oferecidos e seus respectivos preços/duração.
  5. Configura o horário de funcionamento para cada dia da semana.
- **Faça:** Utilize botões de alternância (Switches) para ativar/desativar dias de funcionamento rapidamente.

## Padrão 6: Gestão de Agenda (Fluxo do Profissional)

- **Objetivo do usuário:** Visualizar compromissos do dia e marcar períodos de indisponibilidade.
- **Componentes usados:** [Agenda/Calendário](04-componentes/calendario.md), [Lista de Tarefas](04-componentes/lista.md).
- **Passos:**
  1. O profissional acessa "Minha Agenda".
  2. Visualiza os horários ocupados por clientes (com status: confirmado, pendente, etc.).
  3. Acessa a tela de "Indisponibilidades" para bloquear horários (almoço, folga, compromisso pessoal).
  4. Define se o bloqueio é recorrente ou pontual.
- **Faça:** Use cores diferentes para distinguir agendamentos de clientes de bloqueios manuais.
- **Evite:** Deixar o profissional sobrepor um bloqueio manual a um agendamento já confirmado sem aviso.

## Padrão 7: Gestão de Agendamentos (Cliente)

- **Objetivo do usuário:** Acompanhar agendamentos futuros, reagendar ou cancelar compromissos.
- **Componentes usados:** [Card](04-componentes/card.md), [Badge/Etiqueta](04-componentes/badge.md), [Botão](04-componentes/botao.md).
- **Passos:**
  1. O usuário acessa a aba "Agendas" no menu inferior.
  2. Visualiza a lista de "Próximos" agendamentos.
  3. Seleciona um agendamento para ver detalhes ou realizar ações.
  4. Clica em "Reagendar" para escolher uma nova data/horário ou "Cancelar" para desistir do serviço.
- **Estados que precisam de tela:**

| Situação | O que o usuário vê | Componentes e tokens |
| --- | --- | --- |
| Confirmado | Badge verde indicando sucesso | `color.action` (variante verde) |
| Pendente | Badge amarelo indicando espera | `color.action` (variante amarela) |
| Cancelado | Badge vermelho ou texto riscado | `color.error` |

## Padrão 8: Onboarding de Parceiro (Cadastro de Barbearia)

- **Objetivo do usuário:** Criar uma conta já vinculada a uma nova barbearia no sistema.
- **Componentes usados:** [Campo de Texto](04-componentes/campo-de-texto.md), [Upload de Imagem](04-componentes/upload.md), [Botão](04-componentes/botao.md).
- **Passos:**
  1. O usuário escolhe a opção de se cadastrar como barbearia.
  2. Preenche a "Seção 1: Seus dados pessoais".
  3. Preenche a "Seção 2: Sua barbearia" (Nome, Telefone, Endereço e Logo).
  4. Finaliza o cadastro e acessa o painel de gestão.
- **Faça:** Divida o formulário em seções claras para não sobrecarregar o usuário.

## Padrão 9: Busca e Filtragem

- **Objetivo do usuário:** Encontrar rapidamente barbearias ou serviços específicos.
- **Componentes usados:** [Barra de Busca](04-componentes/busca.md), [Chips de Filtro](04-componentes/chips.md).
- **Passos:**
  1. Na Home ou na lista de barbearias, o usuário clica na barra de busca.
  2. Digita o nome da barbearia ou serviço.
  3. Utiliza os filtros rápidos (Cabelo, Barba, Combo) para refinar os resultados.
- **Faça:** Mostre sugestões de busca enquanto o usuário digita.
