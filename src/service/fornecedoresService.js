import { api } from 'boot/axios'

export const FornecedoresService = {
  async listar() {
    const { data } = await api.get('/Fornecedores')
    return data
  },

  async buscarPorId(id) {
    const { data } = await api.get(`/Fornecedores/${id}`)
    return data
  },

  async criar(payload) {
    const { data } = await api.post('/Fornecedores', payload)
    return data
  },

  async atualizar(id, payload) {
    const { data } = await api.put(`/Fornecedores/${id}`, payload)
    return data
  },

  async remover(id) {
    await api.delete(`/Fornecedores/${id}`)
  }
}
