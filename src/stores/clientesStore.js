import { defineStore } from 'pinia'
import { ClientesService } from '../service/clientesService'

export const useClientesStore = defineStore('clientes', {
  state: () => ({
    clientes: [],
    loading: false,
    error: null
  }),

  actions: {
    async carregarClientes() {
      this.loading = true
      this.error = null
      try {
        const data = await ClientesService.listar()
        console.log('Resposta de /Clientes:', data, typeof data)
        let parsed = data
        if (typeof data === 'string') {
          try { parsed = JSON.parse(data) } catch (e) { console.warn('Resposta /Clientes não é JSON parseável:', e) }
        }
        if (Array.isArray(parsed)) {
          this.clientes = parsed
          console.log('Clientes carregados:', this.clientes.length)
        }
        else {
          console.warn('Dados recebidos de /Clientes não são um array:', parsed)
          this.clientes = []
        }
      } catch (err) {
        console.error('Erro ao carregar clientes:', err)
        this.error = 'Erro ao carregar clientes. ' + (err && err.message ? err.message : '')
        this.clientes = []
      } finally { this.loading = false }
    },

    async adicionarCliente(payload) {
      this.loading = true
      try {
        const criado = await ClientesService.criar(payload)
        if (criado) this.clientes.push(criado)
        return criado
      } catch (err) {
        console.error('Erro ao criar cliente:', err)
        this.error = 'Erro ao criar cliente. ' + (err && err.message ? err.message : '')
        throw err
      } finally { this.loading = false }
    },

    async atualizarCliente(id, payload) {
      this.loading = true
      try {
        const atualizado = await ClientesService.atualizar(id, payload)
        const idx = this.clientes.findIndex(c => c.id === id)
        if (idx !== -1) this.clientes.splice(idx, 1, atualizado)
        return atualizado
      } catch (err) {
        console.error('Erro ao atualizar cliente:', err)
        this.error = 'Erro ao atualizar cliente. ' + (err && err.message ? err.message : '')
        throw err
      } finally { this.loading = false }
    },

    async removerCliente(id) {
      this.loading = true
      try {
        await ClientesService.remover(id)
        this.clientes = this.clientes.filter(c => c.id !== id)
      } catch (err) {
        console.error('Erro ao remover cliente:', err)
        this.error = 'Erro ao remover cliente. ' + (err && err.message ? err.message : '')
        throw err
      } finally { this.loading = false }
    }
  }
})
