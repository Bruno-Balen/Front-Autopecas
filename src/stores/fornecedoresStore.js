import { defineStore } from 'pinia'
import { FornecedoresService } from '../service/fornecedoresService'

export const useFornecedoresStore = defineStore('fornecedores', {
  state: () => ({
    fornecedores: [],
    loading: false,
    error: null
  }),

  actions: {
    async carregarFornecedores() {
      this.loading = true
      this.error = null
      try {
        const data = await FornecedoresService.listar()
        console.log('Resposta de /Fornecedores:', data, typeof data)
        let parsed = data
        if (typeof data === 'string') {
          try { parsed = JSON.parse(data) } catch (e) { console.warn('Resposta /Fornecedores não é JSON parseável:', e) }
        }
        if (Array.isArray(parsed)) {
          this.fornecedores = parsed
          console.log('Fornecedores carregados:', this.fornecedores.length)
        }
        else {
          console.warn('Dados recebidos de /Fornecedores não são um array:', parsed)
          this.fornecedores = []
        }
      } catch (err) {
        console.error('Erro ao carregar fornecedores:', err)
        this.error = 'Erro ao carregar fornecedores. ' + (err && err.message ? err.message : '')
        this.fornecedores = []
      } finally { this.loading = false }
    },

    async adicionarFornecedor(payload) {
      this.loading = true
      try {
        const criada = await FornecedoresService.criar(payload)
        if (criada) this.fornecedores.push(criada)
        return criada
      } catch (err) {
        console.error('Erro ao criar fornecedor:', err)
        this.error = 'Erro ao criar fornecedor. ' + (err && err.message ? err.message : '')
        throw err
      } finally { this.loading = false }
    },

    async atualizarFornecedor(id, payload) {
      this.loading = true
      try {
        const atualizada = await FornecedoresService.atualizar(id, payload)
        const idx = this.fornecedores.findIndex(f => f.id === id)
        if (idx !== -1) this.fornecedores.splice(idx, 1, atualizada)
        return atualizada
      } catch (err) {
        console.error('Erro ao atualizar fornecedor:', err)
        this.error = 'Erro ao atualizar fornecedor. ' + (err && err.message ? err.message : '')
        throw err
      } finally { this.loading = false }
    },

    async removerFornecedor(id) {
      this.loading = true
      try {
        await FornecedoresService.remover(id)
        this.fornecedores = this.fornecedores.filter(f => f.id !== id)
      } catch (err) {
        console.error('Erro ao remover fornecedor:', err)
        this.error = 'Erro ao remover fornecedor. ' + (err && err.message ? err.message : '')
        throw err
      } finally { this.loading = false }
    }
  }
})
