import { api } from 'boot/axios'

export const DashboardService = {
  async carregarTopPecas(limite = 4) {
    try {
      const { data } = await api.get(`/Dashboard/TopPecas?limite=${limite}`)
      console.log('Top Peças carregadas:', data)
      return data
    } catch (err) {
      console.error('Erro ao carregar top peças:', err)
      console.warn('Retornando array vazio - fallback para mock será aplicado')
      return []
    }
  },

  async carregarTopCategorias(limite = 4) {
    try {
      const { data } = await api.get(`/Dashboard/TopCategorias?limite=${limite}`)
      console.log('Top Categorias carregadas:', data)
      return data
    } catch (err) {
      console.error('Erro ao carregar top categorias:', err)
      console.warn('Retornando array vazio - fallback para mock será aplicado')
      return []
    }
  }
}
