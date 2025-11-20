import { defineStore } from 'pinia'
import { CategoriasService } from '../service/categoriasService'

export const useCategoriasStore = defineStore('categorias', {
  state: () => ({
    categorias: [],
    loading: false,
    error: null
  }),

  actions: {
    async carregarCategorias() {
      this.loading = true
      this.error = null
      try {
        const data = await CategoriasService.listar()
        console.log('Resposta de /Categorias:', data, typeof data)
        let parsed = data
        if (typeof data === 'string') {
          try { parsed = JSON.parse(data) } catch (e) { console.warn('Resposta /Categorias não é JSON parseável:', e) }
        }
        if (Array.isArray(parsed)) {
          this.categorias = parsed
          console.log('Categorias carregadas:', this.categorias.length)
        }
        else {
          console.warn('Dados recebidos de /Categorias não são um array:', parsed)
          this.categorias = []
        }
      } catch (err) {
        console.error('Erro ao carregar categorias:', err)
        this.error = 'Erro ao carregar categorias. ' + (err && err.message ? err.message : '')
        this.categorias = []
      } finally {
        this.loading = false
      }
    },

    async adicionarCategoria(payload) {
      this.loading = true
      try {
        const criada = await CategoriasService.criar(payload)
        if (criada) this.categorias.push(criada)
        return criada
      } catch (err) {
        console.error('Erro ao criar categoria:', err)
        this.error = 'Erro ao criar categoria. ' + (err && err.message ? err.message : '')
        throw err
      } finally { this.loading = false }
    },

    async atualizarCategoria(id, payload) {
      this.loading = true
      try {
        const atualizada = await CategoriasService.atualizar(id, payload)
        const idx = this.categorias.findIndex(c => c.id === id)
        if (idx !== -1) this.categorias.splice(idx, 1, atualizada)
        return atualizada
      } catch (err) {
        console.error('Erro ao atualizar categoria:', err)
        this.error = 'Erro ao atualizar categoria. ' + (err && err.message ? err.message : '')
        throw err
      } finally { this.loading = false }
    },

    async removerCategoria(id) {
      this.loading = true
      try {
        await CategoriasService.remover(id)
        this.categorias = this.categorias.filter(c => c.id !== id)
      } catch (err) {
        console.error('Erro ao remover categoria:', err)
        this.error = 'Erro ao remover categoria. ' + (err && err.message ? err.message : '')
        throw err
      } finally { this.loading = false }
    }
  }
})
