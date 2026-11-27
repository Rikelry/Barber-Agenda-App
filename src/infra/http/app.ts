// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import express, { Router } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import { apiLimiter, authLimiter } from './middlewares/rateLimiter'
import { errorHandler } from './middlewares/errorHandler'
import { routerAuth, routerUsers } from './routes/usuario.routes'
import { routerBarbershop } from './routes/barbershop.routes'
import { routerProfissional } from './routes/professional.routes'
import { routerProfissionalMe } from './routes/professional-me.routes'
import { routerServico } from './routes/service.routes'
import { routerAgendamento } from './routes/agendamento.routes'
import { UsuarioController } from './controllers/UsuarioController'
import { BarbeariaController } from './controllers/BarbeariaController'
import { BusinessHoursController } from './controllers/BusinessHoursController'
import { SupabaseBusinessHoursRepository } from '../datasources/SupabaseBusinessHoursRepository'
import { CriarHorarioFuncionamentoUseCase } from '../../usecase/CriarHorarioFuncionamentoUseCase'
import { ListarHorariosFuncionamentoUseCase } from '../../usecase/ListarHorariosFuncionamentoUseCase'
import { ProfissionalController } from './controllers/ProfissionalController'
import { ServicoController } from './controllers/ServicoController'
import { AgendamentoController } from './controllers/AgendamentoController'
import { HorariosDisponiveisController } from './controllers/HorariosDisponiveisController'
import { routerHorariosDisponiveis } from './routes/horarios-disponiveis.routes'
import { ListarHorariosDisponiveisUseCase } from '../../usecase/ListarHorariosDisponiveisUseCase'
import { CadastrarUsuarioUseCase } from '../../usecase/CadastrarUsuarioUseCase'
import { SupabaseUsuarioRepository } from '../datasources/SupabaseUsuarioRepository'
import { AutenticarUsuarioUseCase } from '../../usecase/AutenticarUsuarioUseCase'
import { BuscarUsuarioUseCase } from '../../usecase/BuscarUsuarioUseCase'
import { EncerrarSessaoUseCase } from '../../usecase/EncerrarSessaoUseCase'
import { AtualizarUsuarioUseCase } from '../../usecase/AtualizarUsuarioUseCase'
import { RenovarTokenUseCase } from '../../usecase/RenovarTokenUseCase'
import { SolicitarRecuperacaoSenhaUseCase } from '../../usecase/SolicitarRecuperacaoSenhaUseCase'
import { RedefinirSenhaUseCase } from '../../usecase/RedefinirSenhaUseCase'
import { ExcluirContaUseCase } from '../../usecase/ExcluirContaUseCase'
import { SupabasePasswordResetTokenRepository } from '../datasources/SupabasePasswordResetTokenRepository'
import { NodemailerEmailService } from '../services/NodemailerEmailService'
import { EmailNotificationService } from '../services/EmailNotificationService'
import { SupabaseBarbeariaRepository } from '../datasources/SupabaseBarbeariaRepository'
import { CriarBarbeariaUseCase } from '../../usecase/CriarBarbeariaUseCase'
import { ListarBarbeariasUseCase } from '../../usecase/ListarBarbeariasUseCase'
import { BuscarBarbeariaPorIdUseCase } from '../../usecase/BuscarBarbeariaPorIdUseCase'
import { AtualizarBarbeariaUseCase } from '../../usecase/AtualizarBarbeariaUseCase'
import { SupabaseProfissionalRepository } from '../datasources/SupabaseProfissionalRepository'
import { CadastrarProfissionalUseCase } from '../../usecase/CadastrarProfissionalUseCase'
import { ListarProfissionaisUseCase } from '../../usecase/ListarProfissionaisUseCase'
import { BuscarProfissionalUseCase } from '../../usecase/BuscarProfissionalUseCase'
import { AtualizarProfissionalUseCase } from '../../usecase/AtualizarProfissionalUseCase'
import { RemoverProfissionalUseCase } from '../../usecase/RemoverProfissionalUseCase'
import { TornarSeProfissionalUseCase } from '../../usecase/TornarSeProfissionalUseCase'
import { BuscarMeuProfissionalUseCase } from '../../usecase/BuscarMeuProfissionalUseCase'
import { SupabaseServicoRepository } from '../datasources/SupabaseServicoRepository'
import { CadastrarServicoUseCase } from '../../usecase/CadastrarServicoUseCase'
import { AtualizarServicoUseCase } from '../../usecase/AtualizarServicoUseCase'
import { ListarServicosUseCase } from '../../usecase/ListarServicosUseCase'
import { ListarAgendaProfissionalUseCase } from '../../usecase/ListarAgendaProfissionalUseCase'
import { ListarAgendamentosClienteUseCase } from '../../usecase/ListarAgendamentosClienteUseCase'
import { CriarAgendamentoUseCase } from '../../usecase/CriarAgendamentoUseCase'
import { CancelarAgendamentoUseCase } from '../../usecase/CancelarAgendamentoUseCase'
import { ConcluirAgendamentoUseCase } from '../../usecase/ConcluirAgendamentoUseCase'
import { ReagendarAgendamentoUseCase } from '../../usecase/ReagendarAgendamentoUseCase'
import { SupabaseAgendamentoRepository } from '../datasources/SupabaseAgendamentoRepository'
import { MontarItensDeAgenda } from '../../usecase/MontarItensDeAgenda'
import { ListarAgendaBarbeariaUseCase } from '../../usecase/ListarAgendaBarbeariaUseCase'
import { ResponderSolicitacaoUseCase } from '../../usecase/ResponderSolicitacaoUseCase'
import { MudarAtendimentoUseCase } from '../../usecase/MudarAtendimentoUseCase'
import { SugerirHorarioUseCase } from '../../usecase/SugerirHorarioUseCase'
import { ResponderSugestaoUseCase } from '../../usecase/ResponderSugestaoUseCase'
import { routerIndisponibilidade } from './routes/unavailability.routes'
import { IndisponibilidadeController } from './controllers/IndisponibilidadeController'
import { SupabaseIndisponibilidadeRepository } from '../datasources/SupabaseIndisponibilidadeRepository'
import { RegistrarIndisponibilidadeUseCase } from '../../usecase/RegistrarIndisponibilidadeUseCase'
import { RemoverIndisponibilidadeUseCase } from '../../usecase/RemoverIndisponibilidadeUseCase'
import { ListarIndisponibilidadesUseCase } from '../../usecase/ListarIndisponibilidadesUseCase'
import { VerificarBloqueioUseCase } from '../../usecase/VerificarBloqueioUseCase'
import { routerIndisponibilidadeRecorrente } from './routes/recurring-unavailability.routes'
import { IndisponibilidadeRecorrenteController } from './controllers/IndisponibilidadeRecorrenteController'
import { SupabaseIndisponibilidadeRecorrenteRepository } from '../datasources/SupabaseIndisponibilidadeRecorrenteRepository'
import { RegistrarIndisponibilidadeRecorrenteUseCase } from '../../usecase/RegistrarIndisponibilidadeRecorrenteUseCase'
import { RemoverIndisponibilidadeRecorrenteUseCase } from '../../usecase/RemoverIndisponibilidadeRecorrenteUseCase'
import { ListarIndisponibilidadesRecorrentesUseCase } from '../../usecase/ListarIndisponibilidadesRecorrentesUseCase'
import { routerStorage } from './routes/storage.routes'
import { routerPortfolio } from './routes/portfolio.routes'
import { PortfolioController } from './controllers/PortfolioController'
import { SupabasePortfolioRepository } from '../datasources/SupabasePortfolioRepository'
import {
  AdicionarFotoPortfolioUseCase,
  ListarPortfolioUseCase,
  RemoverFotoPortfolioUseCase,
} from '../../usecase/PortfolioServerUseCases'

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())
app.use(apiLimiter)

// Composição das dependências
const usuarioRepository = new SupabaseUsuarioRepository()
// Instanciados aqui (antes do uso "natural" mais abaixo) porque
// AutenticarUsuarioUseCase/BuscarUsuarioUseCase/RenovarTokenUseCase
// precisam deles para calcular os papéis (roles) do usuário — ver
// construirRolesUsuario.ts.
const barbeariaRepository = new SupabaseBarbeariaRepository()
const profissionalRepository = new SupabaseProfissionalRepository()

const cadastrarUsuarioUseCase = new CadastrarUsuarioUseCase(usuarioRepository)
const autenticarUsuarioUseCase = new AutenticarUsuarioUseCase(
  usuarioRepository,
  barbeariaRepository,
  profissionalRepository
)
const buscarUsuarioUseCase = new BuscarUsuarioUseCase(usuarioRepository, barbeariaRepository, profissionalRepository)
const encerrarSessaoUseCase = new EncerrarSessaoUseCase()
const atualizarUsuarioUseCase = new AtualizarUsuarioUseCase(usuarioRepository, barbeariaRepository, profissionalRepository)
const excluirContaUseCase = new ExcluirContaUseCase(usuarioRepository)
const renovarTokenUseCase = new RenovarTokenUseCase(usuarioRepository, barbeariaRepository, profissionalRepository)

// RF030 — Recuperação de senha
const passwordResetTokenRepository = new SupabasePasswordResetTokenRepository()
const emailService = new NodemailerEmailService()
// RF012/RF013 — Adapter de notificação (ADR-006); hoje só e-mail.
const notificationService = new EmailNotificationService()
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
const solicitarRecuperacaoSenhaUseCase = new SolicitarRecuperacaoSenhaUseCase(
  usuarioRepository,
  passwordResetTokenRepository,
  emailService,
  frontendUrl
)
const redefinirSenhaUseCase = new RedefinirSenhaUseCase(usuarioRepository, passwordResetTokenRepository)

const usuarioController = new UsuarioController(
  cadastrarUsuarioUseCase,
  autenticarUsuarioUseCase,
  buscarUsuarioUseCase,
  encerrarSessaoUseCase,
  atualizarUsuarioUseCase,
  solicitarRecuperacaoSenhaUseCase,
  redefinirSenhaUseCase,
  excluirContaUseCase,
  renovarTokenUseCase
)

const criarBarbeariaUseCase = new CriarBarbeariaUseCase(barbeariaRepository, usuarioRepository)
const listarBarbeariasUseCase = new ListarBarbeariasUseCase(barbeariaRepository)
const buscarBarbeariaPorIdUseCase = new BuscarBarbeariaPorIdUseCase(barbeariaRepository)
const atualizarBarbeariaUseCase = new AtualizarBarbeariaUseCase(barbeariaRepository)
const barbeariaController = new BarbeariaController(
  criarBarbeariaUseCase,
  listarBarbeariasUseCase,
  buscarBarbeariaPorIdUseCase,
  atualizarBarbeariaUseCase
)

const businessHoursRepository = new SupabaseBusinessHoursRepository()
const criarHorarioFuncionamentoUseCase = new CriarHorarioFuncionamentoUseCase(businessHoursRepository, barbeariaRepository)
const listarHorariosFuncionamentoUseCase = new ListarHorariosFuncionamentoUseCase(businessHoursRepository)
const businessHoursController = new BusinessHoursController(
  criarHorarioFuncionamentoUseCase,
  listarHorariosFuncionamentoUseCase
)

const cadastrarProfissionalUseCase = new CadastrarProfissionalUseCase(
  profissionalRepository,
  usuarioRepository,
  barbeariaRepository
)
const listarProfissionaisUseCase = new ListarProfissionaisUseCase(profissionalRepository, barbeariaRepository)
const buscarProfissionalUseCase = new BuscarProfissionalUseCase(profissionalRepository, barbeariaRepository)
const atualizarProfissionalUseCase = new AtualizarProfissionalUseCase(
  profissionalRepository,
  usuarioRepository,
  barbeariaRepository
)
const removerProfissionalUseCase = new RemoverProfissionalUseCase(profissionalRepository, barbeariaRepository)
const tornarSeProfissionalUseCase = new TornarSeProfissionalUseCase(
  profissionalRepository,
  usuarioRepository,
  barbeariaRepository
)
const buscarMeuProfissionalUseCase = new BuscarMeuProfissionalUseCase(profissionalRepository)
const profissionalController = new ProfissionalController(
  cadastrarProfissionalUseCase,
  listarProfissionaisUseCase,
  buscarProfissionalUseCase,
  atualizarProfissionalUseCase,
  removerProfissionalUseCase,
  tornarSeProfissionalUseCase,
  buscarMeuProfissionalUseCase
)

const servicoRepository = new SupabaseServicoRepository()
const cadastrarServicoUseCase = new CadastrarServicoUseCase(servicoRepository, barbeariaRepository)
const atualizarServicoUseCase = new AtualizarServicoUseCase(servicoRepository, barbeariaRepository)
const listarServicosUseCase = new ListarServicosUseCase(servicoRepository, barbeariaRepository)
const servicoController = new ServicoController(
  cadastrarServicoUseCase,
  atualizarServicoUseCase,
  listarServicosUseCase
)


const indisponibilidadeRepository = new SupabaseIndisponibilidadeRepository()
const registrarIndisponibilidadeUseCase = new RegistrarIndisponibilidadeUseCase(
  indisponibilidadeRepository,
  profissionalRepository,
  barbeariaRepository,
  businessHoursRepository
)
const removerIndisponibilidadeUseCase = new RemoverIndisponibilidadeUseCase(
  indisponibilidadeRepository,
  profissionalRepository,
  barbeariaRepository
)
const listarIndisponibilidadesUseCase = new ListarIndisponibilidadesUseCase(indisponibilidadeRepository)
const indisponibilidadeController = new IndisponibilidadeController(
  registrarIndisponibilidadeUseCase,
  removerIndisponibilidadeUseCase,
  listarIndisponibilidadesUseCase
)

const indisponibilidadeRecorrenteRepository = new SupabaseIndisponibilidadeRecorrenteRepository()
const registrarIndisponibilidadeRecorrenteUseCase = new RegistrarIndisponibilidadeRecorrenteUseCase(
  indisponibilidadeRecorrenteRepository,
  profissionalRepository,
  barbeariaRepository,
  businessHoursRepository
)
const removerIndisponibilidadeRecorrenteUseCase = new RemoverIndisponibilidadeRecorrenteUseCase(
  indisponibilidadeRecorrenteRepository,
  profissionalRepository,
  barbeariaRepository
)
const listarIndisponibilidadesRecorrentesUseCase = new ListarIndisponibilidadesRecorrentesUseCase(
  indisponibilidadeRecorrenteRepository
)
const indisponibilidadeRecorrenteController = new IndisponibilidadeRecorrenteController(
  registrarIndisponibilidadeRecorrenteUseCase,
  removerIndisponibilidadeRecorrenteUseCase,
  listarIndisponibilidadesRecorrentesUseCase
)

const verificarBloqueioUseCase = new VerificarBloqueioUseCase(
  indisponibilidadeRepository,
  indisponibilidadeRecorrenteRepository
)

const agendamentoRepository = new SupabaseAgendamentoRepository()
const montarItensDeAgenda = new MontarItensDeAgenda(profissionalRepository, servicoRepository, usuarioRepository)
const listarAgendaProfissionalUseCase = new ListarAgendaProfissionalUseCase(agendamentoRepository, montarItensDeAgenda)
const listarAgendaBarbeariaUseCase = new ListarAgendaBarbeariaUseCase(
  agendamentoRepository,
  barbeariaRepository,
  montarItensDeAgenda
)
const responderSolicitacaoUseCase = new ResponderSolicitacaoUseCase(
  agendamentoRepository,
  profissionalRepository,
  barbeariaRepository
)
const listarAgendamentosClienteUseCase = new ListarAgendamentosClienteUseCase(
  agendamentoRepository,
  profissionalRepository,
  servicoRepository,
  usuarioRepository
)
const criarAgendamentoUseCase = new CriarAgendamentoUseCase(
  agendamentoRepository,
  profissionalRepository,
  servicoRepository,
  usuarioRepository,
  businessHoursRepository,
  verificarBloqueioUseCase,
  notificationService
)
const cancelarAgendamentoUseCase = new CancelarAgendamentoUseCase(
  agendamentoRepository,
  profissionalRepository,
  barbeariaRepository,
  usuarioRepository,
  servicoRepository,
  notificationService
)
const concluirAgendamentoUseCase = new ConcluirAgendamentoUseCase(
  agendamentoRepository,
  profissionalRepository,
  barbeariaRepository
)
const reagendarAgendamentoUseCase = new ReagendarAgendamentoUseCase(
  agendamentoRepository,
  profissionalRepository,
  servicoRepository,
  usuarioRepository,
  businessHoursRepository,
  verificarBloqueioUseCase,
  barbeariaRepository
)
const agendamentoController = new AgendamentoController(
  listarAgendaProfissionalUseCase,
  listarAgendamentosClienteUseCase,
  profissionalRepository,
  criarAgendamentoUseCase,
  cancelarAgendamentoUseCase,
  concluirAgendamentoUseCase,
  reagendarAgendamentoUseCase,
  responderSolicitacaoUseCase,
  listarAgendaBarbeariaUseCase,
  new MudarAtendimentoUseCase(agendamentoRepository, profissionalRepository, barbeariaRepository),
  new SugerirHorarioUseCase(
    agendamentoRepository,
    profissionalRepository,
    barbeariaRepository,
    servicoRepository,
    businessHoursRepository,
    verificarBloqueioUseCase
  ),
  new ResponderSugestaoUseCase(agendamentoRepository)
)

const listarHorariosDisponiveisUseCase = new ListarHorariosDisponiveisUseCase(
  profissionalRepository,
  servicoRepository,
  businessHoursRepository,
  agendamentoRepository,
  indisponibilidadeRepository,
  indisponibilidadeRecorrenteRepository
)
const horariosDisponiveisController = new HorariosDisponiveisController(listarHorariosDisponiveisUseCase)

// Rotas — versionadas sob /api/v1 (endpoints.md)
const apiV1 = Router()
apiV1.use('/auth', authLimiter, routerAuth(usuarioController))
apiV1.use('/users', routerUsers(usuarioController))
apiV1.use('/barbershops', routerBarbershop(barbeariaController, businessHoursController))
apiV1.use('/barbershops/:barbershopId/professionals', routerProfissional(profissionalController))
apiV1.use('/professionals', routerProfissionalMe(profissionalController))
apiV1.use('/barbershops/:barbershopId/services', routerServico(servicoController))
apiV1.use('/agendamentos', routerAgendamento(agendamentoController))
// /appointments é o nome documentado em endpoints.md — mantido como alias
// do /agendamentos já usado pelo RF021, mesmo padrão do /redefinir-senha
// vs /reset-password no frontend.
apiV1.use('/appointments', routerAgendamento(agendamentoController))
apiV1.use(
  '/barbershops/:barbershopId/professionals/:professionalId/unavailability',
  routerIndisponibilidade(indisponibilidadeController)
)
apiV1.use(
  '/barbershops/:barbershopId/professionals/:professionalId/recurring-unavailability',
  routerIndisponibilidadeRecorrente(indisponibilidadeRecorrenteController)
)
apiV1.use(
  '/barbershops/:barbershopId/professionals/:professionalId/available-slots',
  routerHorariosDisponiveis(horariosDisponiveisController)
)
apiV1.use('/storage', routerStorage())

// Portfólio do profissional e Inspirações
const portfolioRepository = new SupabasePortfolioRepository()
const portfolioController = new PortfolioController(
  new ListarPortfolioUseCase(portfolioRepository, profissionalRepository),
  new AdicionarFotoPortfolioUseCase(portfolioRepository, profissionalRepository, servicoRepository),
  new RemoverFotoPortfolioUseCase(portfolioRepository, profissionalRepository)
)
apiV1.use('/portfolio', routerPortfolio(portfolioController))

app.use('/api/v1', apiV1)

// Fallback 404 em JSON (evita que o Express retorne HTML default)
app.use((req, res) => {
  res.status(404).json({
    error: 'NOT_FOUND',
    message: `Rota ${req.method} ${req.originalUrl} não encontrada.`,
  })
})

app.use(errorHandler)

export default app
