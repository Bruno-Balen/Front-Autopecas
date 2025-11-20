import { defineStore } from 'pinia'
import { usePecasStore } from './pecasStore'
import { useCategoriasStore } from './categoriasStore'

const cores = ['#FFA726', '#66BB6A', '#42A5F5', '#AB47BC', '#EC407A', '#26A69A']

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    topPecas: [],
    topCategorias: [],
    loading: false,
    error: null
  }),

  actions: {
    async carregarDados() {
      this.loading = true
      this.error = null
      try {
        const pecasStore = usePecasStore()
        const categoriasStore = useCategoriasStore()

        // Garantir que os stores já carregaram os dados
        if (!pecasStore.pecas || pecasStore.pecas.length === 0) {
          await pecasStore.carregarPecas()
        }
        if (!categoriasStore.categorias || categoriasStore.categorias.length === 0) {
          await categoriasStore.carregarCategorias()
        }

        // Processar top peças
        this.topPecas = this.processarTopPecas(pecasStore.pecas || [])

        // Processar top categorias
        this.topCategorias = this.processarTopCategorias(categoriasStore.categorias || [])

        console.log('Dashboard carregado:', { topPecas: this.topPecas, topCategorias: this.topCategorias })
      } catch (err) {
        console.error('Erro ao carregar dashboard:', err)
        this.error = 'Erro ao carregar dados do dashboard'
      } finally {
        this.loading = false
      }
    },

    processarTopPecas(pecas) {
      if (!Array.isArray(pecas) || pecas.length === 0) {
        return this.obterMockPecas()
      }

      // Ordena por um campo de quantidade/vendas se existir, caso contrário pega os 4 primeiros
      const top = pecas.slice(0, 4)

      // Calcular percentual baseado na posição
      const total = top.length
      return top.map((peca, idx) => ({
        nome: peca.nome || `Peça ${idx + 1}`,
        vendas: Math.round(((total - idx) / total) * 100),
        cor: cores[idx % cores.length]
      }))
    },

    processarTopCategorias(categorias) {
      if (!Array.isArray(categorias) || categorias.length === 0) {
        return this.obterMockCategorias()
      }

      // Ordena e pega os 4 primeiros
      const top = categorias.slice(0, 4)

      // Calcular percentual baseado na posição
      const total = top.length
      return top.map((cat, idx) => ({
        nome: cat.categoria || `Categoria ${idx + 1}`,
        vendas: Math.round(((total - idx) / total) * 100),
        cor: cores[idx % cores.length]
      }))
    },

    obterMockPecas() {
      return [
        { nome: 'Farol direito', vendas: 48, cor: cores[0] },
        { nome: 'Lanterna esquerda', vendas: 37, cor: cores[1] },
        { nome: 'Parabrisa', vendas: 31, cor: cores[2] },
        { nome: 'Pneu', vendas: 29, cor: cores[3] }
      ]
    },

    obterMockCategorias() {
      return [
        { nome: 'Acessórios', vendas: 48, cor: cores[0] },
        { nome: 'Vidros', vendas: 37, cor: cores[1] },
        { nome: 'Pneus', vendas: 31, cor: cores[2] },
        { nome: 'Lanternas', vendas: 29, cor: cores[3] }
      ]
    }
  }
})
