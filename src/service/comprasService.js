import { api } from 'boot/axios'

export const ComprasService = {
  async listar() {
    const { data } = await api.get('/Compras')
    return data
  },

  async buscarPorId(id) {
    const { data } = await api.get(`/Compras/${id}`)
    return data
  },

  async criar(payload) {
    const { data } = await api.post('/Compras', payload)
    return data
  },

  async atualizar(id, payload) {
    const { data } = await api.put(`/Compras/${id}`, payload)
    return data
  },

  async remover(id) {
    await api.delete(`/Compras/${id}`)
  }
}
