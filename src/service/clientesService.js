import { api } from 'boot/axios'

export const ClientesService = {
  async listar() {
    const { data } = await api.get('/Clientes')
    return data
  },

  async buscarPorId(id) {
    const { data } = await api.get(`/Clientes/${id}`)
    return data
  },

  async criar(payload) {
    const { data } = await api.post('/Clientes', payload)
    return data
  },

  async atualizar(id, payload) {
    const { data } = await api.put(`/Clientes/${id}`, payload)
    return data
  },

  async remover(id) {
    if (id === undefined || id === null) {
      throw new Error('ID do cliente não fornecido para remoção')
    }
    await api.delete('/Clientes', { params: { id } })
  }
}
