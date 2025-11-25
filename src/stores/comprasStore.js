import { defineStore } from 'pinia'
import { ComprasService } from '../service/comprasService'

export const useComprasStore = defineStore('compras', {
  state: () => ({
    compras: [],
    loading: false,
    error: null
  }),

  actions: {
    async carregarCompras() {
      this.loading = true
      this.error = null
      try {
        const data = await ComprasService.listar()
        let parsed = data
        if (typeof data === 'string') {
          try { parsed = JSON.parse(data) } catch (e) { console.warn('Resposta /Compras não é JSON parseável:', e) }
        }
        if (Array.isArray(parsed)) {
          const normalized = parsed.map(item => {
            const id = item.id ?? item.idcompra ?? item.idCompra ?? item.IdCompra ?? item.ID
            return { ...item, id }
          })
          this.compras = normalized
        }
        else {
          console.warn('Dados recebidos de /Compras não são um array:', parsed)
          this.compras = []
        }
      } catch (err) {
        console.error('Erro ao carregar compras:', err)
        this.error = 'Erro ao carregar compras. ' + (err && err.message ? err.message : '')
        this.compras = []
      } finally { this.loading = false }
    },

    async adicionarCompra(payload) {
      this.loading = true
      try {
        const criada = await ComprasService.criar(payload)
        if (criada) this.compras.push(criada)
        return criada
      } catch (err) {
        console.error('Erro ao criar compra:', err)
        this.error = 'Erro ao criar compra. ' + (err && err.message ? err.message : '')
        throw err
      } finally { this.loading = false }
    },

    async atualizarCompra(id, payload) {
      this.loading = true
      try {
        const atualizada = await ComprasService.atualizar(id, payload)
        const idx = this.compras.findIndex(c => c.id === id)
        if (idx !== -1) this.compras.splice(idx, 1, atualizada)
        return atualizada
      } catch (err) {
        console.error('Erro ao atualizar compra:', err)
        this.error = 'Erro ao atualizar compra. ' + (err && err.message ? err.message : '')
        throw err
      } finally { this.loading = false }
    },

    async removerCompra(id) {
      this.loading = true
      try {
        await ComprasService.remover(id)
        this.compras = this.compras.filter(c => c.id !== id)
      } catch (err) {
        console.error('Erro ao remover compra:', err)
        this.error = 'Erro ao remover compra. ' + (err && err.message ? err.message : '')
        throw err
      } finally { this.loading = false }
    }
  }
})
