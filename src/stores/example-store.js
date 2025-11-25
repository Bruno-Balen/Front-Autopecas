import { defineStore, acceptHMRUpdate } from 'pinia'

export const useContadorStore = defineStore('contador', {
  state: () => ({
    contador: 0,
  }),

  getters: {
    contadorDobrado: (state) => state.contador * 2,
  },

  actions: {
    incrementar() {
      this.contador++
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useContadorStore, import.meta.hot))
}
