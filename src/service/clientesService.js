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
    await api.delete(`/Clientes/${id}`)
  }
}
