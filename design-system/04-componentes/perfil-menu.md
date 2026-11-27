# Menu do Perfil (ProfileSection, ProfileMenuItem, ProfileBarbershopCard)

Origem no sistema base: Material 3, Lists (item de duas linhas) e Cards, organizados como o menu da conta Google. Situação: Adaptado. Código em `src/view/components/profileMenu/`.

## Estrutura da tela Perfil

| Área | Quem vê | Itens |
| --- | --- | --- |
| Identificação | todos | avatar grande, nome (`headlineSmall`), "Membro desde", etiquetas dos papéis reais (Cliente, Profissional, Dono) |
| CONTA | todos | Dados pessoais |
| TRABALHO | papel `profissional` | Meu perfil profissional, Meu portfólio |
| MINHA BARBEARIA | papel `owner` | cartão da barbearia + Informações da barbearia, Horário de funcionamento, Profissionais, Serviços |
| MINHA BARBEARIA (convite) | quem não é dono | Cadastrar minha barbearia |
| Sair da conta | todos | item destrutivo, separado por divisor, com confirmação |

- **Onde a visibilidade é decidida:** nos papéis da sessão (`roles`), relidos sempre que a tela volta a aparecer.
- **O que fica fora do Perfil:** trocar senha e a agenda. A agenda é a aba Trabalho, e a do dono fica na aba Gestão.

## Anatomia

1. **ProfileSection:** título em caixa alta (`labelLarge` 700, `color.secondary`) e um grupo `color.surface-container` com raio 28. Entre os itens há um divisor de 1 dp `outlineVariant`, com recuo de 80 dp (começa depois do ícone).
2. **ProfileMenuItem:** altura mínima de 72 dp e área inteira tocável, com:
   - ícone de 24 dp num círculo de 44 dp em `color.secondary-container`;
   - título `bodyLarge` 500 e descrição `bodyMedium` `color.on-surface-variant`;
   - seta à direita.
   A variante destrutiva usa ícone e texto em `color.error`, o círculo em `errorContainer` e não tem seta.
3. **ProfileBarbershopCard:** contêiner `color.container` com raio 28, foto de 64 dp com raio 16, nome (`titleMedium` 700), "Gerencie seu estabelecimento" e seta.

## Estados

| Estado | Aparência | Acessibilidade |
| --- | --- | --- |
| Padrão | como na anatomia | `button` com rótulo "título, descrição" |
| Pressionado | camada `on-surface` a 12 % (ripple no Android) | — |
| Foco | anel do sistema | ordem de cima para baixo |

## Acessibilidade

- Todos os itens têm pelo menos 72 dp de altura, acima do alvo de 48 dp.
- Os títulos das seções usam `accessibilityRole="header"`.
- As etiquetas de papel são lidas juntas, como "Funções: Cliente, Profissional, Dono".
