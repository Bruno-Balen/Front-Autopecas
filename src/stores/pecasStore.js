import { defineStore } from 'pinia'
import { PecasService } from '../service/pecasService'

export const usePecasStore = defineStore('pecas', {
  state: () => ({
    pecas: [],
    loading: false,
    error: null
  }),

  actions: {
    async carregarPecas() {
      this.loading = true
      this.error = null
      try {
        const data = await PecasService.listar()
        console.log('Resposta de /Pecas:', data, typeof data)
        let parsed = data
        if (typeof data === 'string') {
          try {
            parsed = JSON.parse(data)
          } catch (e) {
            console.warn('Resposta /Pecas não é JSON parseável:', e)
          }
        }
        if (Array.isArray(parsed)) {
          this.pecas = parsed
          console.log('Peças carregadas:', this.pecas.length)
        } else {
          console.warn('Dados recebidos de /Pecas não são um array:', parsed)
          this.pecas = []
        }
      } catch (err) {
        console.error('Erro ao carregar peças:', err)
        this.error = 'Erro ao carregar peças. ' + (err && err.message ? err.message : '')

        this.pecas = []
      } finally {
        this.loading = false
      }
    },

    async adicionarPeca(payload) {
      this.loading = true
      try {
        const criada = await PecasService.criar(payload)
        if (criada) this.pecas.push(criada)
        return criada
      } catch (err) {
        console.error('Erro ao criar peça:', err)
        this.error = 'Erro ao criar peça. ' + (err && err.message ? err.message : '')
        throw err
      } finally {
        this.loading = false
      }
    },

    async atualizarPeca(id, payload) {
      this.loading = true
      try {
        const atualizada = await PecasService.atualizar(id, payload)
        const idx = this.pecas.findIndex(p => p.id === id)
        if (idx !== -1) this.pecas.splice(idx, 1, atualizada)
        return atualizada
      } catch (err) {
        console.error('Erro ao atualizar peça:', err)
        this.error = 'Erro ao atualizar peça. ' + (err && err.message ? err.message : '')
        throw err
      } finally {
        this.loading = false
      }
    },

    async removerPeca(id) {
      this.loading = true
      try {
        await PecasService.remover(id)
        this.pecas = this.pecas.filter(p => p.id !== id)
      } catch (err) {
        console.error('Erro ao remover peça:', err)
        this.error = 'Erro ao remover peça. ' + (err && err.message ? err.message : '')
        throw err
      } finally {
        this.loading = false
      }
    }
  }
})
