# Detalhe da barbearia (BarbershopHero, ServiceCard, ProfessionalCard)

Origem no sistema base: Material 3, Card e Top app bar. Situação: Novo. Motivo: redesign da tela de detalhe (25/11/26). Código em `src/view/components/barbershopDetail/`.

## Anatomia

1. **BarbershopHero:** foto cadastrada da barbearia em largura total, com 29 % da altura da tela (mínimo de 240 dp) e cantos inferiores de 28 dp.
   - **Sem foto:** ícone de loja sobre `color.action`.
   - **Base da foto:** degradê escuro (SVG `assets/images/barbearia/degrade-escuro.svg`). Sobre ele, em branco: nome (`titleLarge` 700), nota com o número de avaliações (só quando houver), endereço, horário de hoje com o selo Aberta/Fechada e telefone.
   - **Voltar:** botão redondo de 48 dp sobre a foto, com fundo `overlay.scrim` a `overlay.control-scrim` e respeitando a área segura.
2. **ServiceCard:** contêiner `color.surface-container`, raio 16 e `elevation.card`.
   - **Esquerda:** foto do serviço de 84 dp, com raio 12. Sem foto, aparece a tesoura.
   - **Centro:** nome (até 2 linhas), duração e descrição curta (até 2 linhas).
   - **Direita:** preço em `color.action` e o botão Agendar (filled).
3. **ProfessionalCard:** mesmo contêiner do ServiceCard, com avatar, nome, especialidade e o botão Escolher (filled, ou tonal quando já escolhido). O profissional escolhido ganha borda de 2 dp em `color.action`, e tocar no card abre o perfil dele.
4. **Serviços | Profissionais:** [Segmented button](segmented-button.md) do Material 3.

## Comportamento

- **Escolher:** volta para Serviços e mostra o aviso "Agendando com <nome> · Trocar". O Agendar então abre o fluxo existente (`/agendamento/novo`) com o profissional já selecionado.
- **Trabalhos da equipe:** galeria horizontal de 128 × 160 dp com o portfólio da barbearia. "Ver todos" abre a grade completa, e sem fotos aparece um estado vazio.
- **Faixa da barra de status:** a faixa em `color.action` atrás da barra de status só aparece quando o conteúdo rola por cima da foto.

## Acessibilidade

- Texto branco sobre o degradê (de 45 % a 85 % de preto) mantém o contraste acima de 4,5:1 mesmo em fotos claras.
- Todos os botões têm pelo menos 48 dp, ou ganham `hitSlop` para chegar a isso.
- A nota só aparece quando a API tiver avaliações.
