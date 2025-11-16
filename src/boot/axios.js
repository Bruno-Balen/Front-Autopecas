import axios from 'axios'

// Em dev usamos path relativo para aproveitar o proxy do Quasar/Vite.
// Em produção, substitua por 'http://seu-backend:porta/api' ou por variável de ambiente.
const api = axios.create({
  baseURL: '/api'
})

export default async ({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api

  return { api }
}

export { axios, api }
