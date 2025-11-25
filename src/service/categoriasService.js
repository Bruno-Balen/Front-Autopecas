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
    if (id === undefined || id === null) {
      throw new Error('ID da categoria não fornecido para remoção')
    }
    await api.delete('/Categorias', { params: { id } })
  }
}
