// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { supabase } from '../database/supabase'
import { Agendamento, STATUS_ATIVOS } from '../../model/entities/Agendamento'
import { IAgendamentoRepository } from '../../model/datasources/IAgendamentoRepository'

function mapRowParaAgendamento(row: any): Agendamento {
  return {
    id: row.id,
    clientId: row.client_id,
    professionalId: row.professional_id,
    serviceId: row.service_id,
    barbershopId: row.barbershop_id,
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    status: row.status,
    rejectionReason: row.rejection_reason ?? null,
    proposedDate: row.proposed_date ?? null,
    proposedStartTime: row.proposed_start_time ?? null,
    proposedEndTime: row.proposed_end_time ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export class SupabaseAgendamentoRepository implements IAgendamentoRepository {
  async listarPorProfissional(professionalId: string): Promise<Agendamento[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('professional_id', professionalId)
      .order('date', { ascending: true })
      .order('start_time', { ascending: true })

    if (error) throw new Error(`Erro ao listar agendamentos do profissional: ${error.message}`)
    return (data ?? []).map(mapRowParaAgendamento)
  }

  async listarPorProfissionalEData(professionalId: string, date: string): Promise<Agendamento[]> {
    // Só agendamentos ativos (pendentes e agendados) bloqueiam horário (mesma regra de existeConflito).
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('professional_id', professionalId)
      .eq('date', date)
      .in('status', STATUS_ATIVOS)
      .order('start_time', { ascending: true })

    if (error) throw new Error(`Erro ao listar agendamentos do profissional na data: ${error.message}`)

    // Horário sugerido ao cliente também fica reservado até ele responder.
    const sugeridos = await supabase
      .from('appointments')
      .select('*')
      .eq('professional_id', professionalId)
      .eq('proposed_date', date)
      .eq('status', 'aguardando_cliente')
    if (sugeridos.error) throw new Error(`Erro ao listar horários sugeridos: ${sugeridos.error.message}`)

    return [
      ...(data ?? []).map(mapRowParaAgendamento),
      ...(sugeridos.data ?? []).map((row: any) => ({
        ...mapRowParaAgendamento(row),
        date: row.proposed_date,
        startTime: row.proposed_start_time,
        endTime: row.proposed_end_time,
      })),
    ]
  }

  async listarPorCliente(clientId: string): Promise<Agendamento[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('client_id', clientId)
      .order('date', { ascending: true })
      .order('start_time', { ascending: true })

    if (error) throw new Error(`Erro ao listar agendamentos do cliente: ${error.message}`)
    return (data ?? []).map(mapRowParaAgendamento)
  }

  async listarPorBarbearia(barbershopId: string): Promise<Agendamento[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('barbershop_id', barbershopId)
      .order('date', { ascending: true })
      .order('start_time', { ascending: true })

    if (error) throw new Error(`Erro ao listar agendamentos da barbearia: ${error.message}`)
    return (data ?? []).map(mapRowParaAgendamento)
  }

  async criar(dados: Omit<Agendamento, 'id' | 'createdAt' | 'updatedAt'>): Promise<Agendamento> {
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        client_id: dados.clientId,
        professional_id: dados.professionalId,
        service_id: dados.serviceId,
        barbershop_id: dados.barbershopId,
        date: dados.date,
        start_time: dados.startTime,
        end_time: dados.endTime,
        status: dados.status,
      })
      .select('*')
      .single()

    if (error) throw new Error(`Erro ao criar agendamento: ${error.message}`)
    return mapRowParaAgendamento(data)
  }

  async existeConflito(
    professionalId: string,
    date: string,
    startTime: string,
    endTime: string,
    excludedId?: string
  ): Promise<boolean> {
    // Só agendamentos ativos ('pendente' e 'agendado') bloqueiam — cancelados, recusados e
    // concluídos liberam o horário (RF008).
    let query = supabase
      .from('appointments')
      .select('id')
      .eq('professional_id', professionalId)
      .eq('date', date)
      .in('status', STATUS_ATIVOS)
      .lt('start_time', endTime)
      .gt('end_time', startTime)

    if (excludedId) {
      query = query.neq('id', excludedId)
    }

    const { data, error } = await query.limit(1)

    if (error) throw new Error(`Erro ao verificar conflito de agendamento: ${error.message}`)
    if ((data?.length ?? 0) > 0) return true

    // Um horário sugerido ao cliente (aguardando resposta) também ocupa a agenda.
    let sugeridos = supabase
      .from('appointments')
      .select('id')
      .eq('professional_id', professionalId)
      .eq('status', 'aguardando_cliente')
      .eq('proposed_date', date)
      .lt('proposed_start_time', endTime)
      .gt('proposed_end_time', startTime)
    if (excludedId) sugeridos = sugeridos.neq('id', excludedId)
    const resposta = await sugeridos.limit(1)
    if (resposta.error) throw new Error(`Erro ao verificar conflito de sugestão: ${resposta.error.message}`)
    return (resposta.data?.length ?? 0) > 0
  }

  async buscarPorId(id: string): Promise<Agendamento | null> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw new Error(`Erro ao buscar agendamento por ID: ${error.message}`)
    }
    return mapRowParaAgendamento(data)
  }

  async atualizar(id: string, dados: Partial<Agendamento>): Promise<Agendamento> {
    const updateData: any = {}
    if (dados.status) updateData.status = dados.status
    if (dados.date) updateData.date = dados.date
    if (dados.startTime) updateData.start_time = dados.startTime
    if (dados.endTime) updateData.end_time = dados.endTime
    if (dados.rejectionReason !== undefined) updateData.rejection_reason = dados.rejectionReason
    if (dados.proposedDate !== undefined) updateData.proposed_date = dados.proposedDate
    if (dados.proposedStartTime !== undefined) updateData.proposed_start_time = dados.proposedStartTime
    if (dados.proposedEndTime !== undefined) updateData.proposed_end_time = dados.proposedEndTime

    const { data, error } = await supabase
      .from('appointments')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw new Error(`Erro ao atualizar agendamento: ${error.message}`)
    return mapRowParaAgendamento(data)
  }
}
