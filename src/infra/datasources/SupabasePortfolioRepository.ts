// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { supabase } from '../database/supabase'
import { FotoPortfolio, NovaFotoPortfolio } from '../../model/entities/FotoPortfolio'
import { IPortfolioRepository } from '../../model/datasources/IPortfolioRepository'

const TABELA = 'portfolio_fotos'
const CAMPOS =
  'id, professional_id, image_url, caption, service_id, featured, created_at, services(name), professionals!inner(barbershop_id, users(name))'

const um = (x: any) => (Array.isArray(x) ? x[0] : x)

function mapRow(row: any): FotoPortfolio {
  const profissional = um(row.professionals)
  return {
    id: row.id,
    professionalId: row.professional_id,
    imageUrl: row.image_url,
    caption: row.caption ?? null,
    serviceId: row.service_id ?? null,
    featured: Boolean(row.featured),
    createdAt: row.created_at,
    serviceName: um(row.services)?.name ?? null,
    professionalName: um(profissional?.users)?.name ?? '',
    barbershopId: profissional?.barbershop_id ?? '',
  }
}

export class SupabasePortfolioRepository implements IPortfolioRepository {
  async listarPorProfissional(professionalId: string): Promise<FotoPortfolio[]> {
    const { data, error } = await supabase
      .from(TABELA)
      .select(CAMPOS)
      .eq('professional_id', professionalId)
      .order('created_at', { ascending: false })
    if (error) throw new Error(`Erro ao listar portfólio: ${error.message}`)
    return (data ?? []).map(mapRow)
  }

  async listarPorBarbearia(barbershopId: string): Promise<FotoPortfolio[]> {
    const { data, error } = await supabase
      .from(TABELA)
      .select(CAMPOS)
      .eq('professionals.barbershop_id', barbershopId)
      .order('created_at', { ascending: false })
    if (error) throw new Error(`Erro ao listar fotos da barbearia: ${error.message}`)
    return (data ?? []).map(mapRow)
  }

  async listarDestaques(limite: number): Promise<FotoPortfolio[]> {
    const { data, error } = await supabase
      .from(TABELA)
      .select(CAMPOS)
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(limite)
    if (error) throw new Error(`Erro ao listar inspirações: ${error.message}`)
    return (data ?? []).map(mapRow)
  }

  async buscarPorId(id: string): Promise<FotoPortfolio | null> {
    const { data, error } = await supabase.from(TABELA).select(CAMPOS).eq('id', id).maybeSingle()
    if (error) throw new Error(`Erro ao buscar foto: ${error.message}`)
    return data ? mapRow(data) : null
  }

  async criar(dados: NovaFotoPortfolio): Promise<FotoPortfolio> {
    const { data, error } = await supabase
      .from(TABELA)
      .insert({
        professional_id: dados.professionalId,
        image_url: dados.imageUrl,
        caption: dados.caption,
        service_id: dados.serviceId,
        featured: dados.featured,
        client_consent: dados.clientConsent,
      })
      .select(CAMPOS)
      .single()
    if (error) throw new Error(`Erro ao publicar foto: ${error.message}`)
    return mapRow(data)
  }

  async remover(id: string): Promise<void> {
    const { error } = await supabase.from(TABELA).delete().eq('id', id)
    if (error) throw new Error(`Erro ao remover foto: ${error.message}`)
  }
}
