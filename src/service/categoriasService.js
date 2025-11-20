import { api } from 'boot/axios'

export const CategoriasService = {
  async listar() {
    const { data } = await api.get('/Categorias')
    return data
  },

  async buscarPorId(id) {
    const { data } = await api.get(`/Categorias/${id}`)
    return data
  },

  async criar(payload) {
    const { data } = await api.post('/Categorias', payload)
    return data
  },

  async atualizar(id, payload) {
    const { data } = await api.put(`/Categorias/${id}`, payload)
    return data
  },

  async remover(id) {
    await api.delete(`/Categorias/${id}`)
  }
}
