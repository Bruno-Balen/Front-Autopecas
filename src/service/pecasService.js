import { api } from 'boot/axios'

export const PecasService = {
	async listar() {
		const { data } = await api.get('/Pecas')
		return data
	},

	async buscarPorId(id) {
		const { data } = await api.get(`/Pecas/${id}`)
		return data
	},

	async criar(payload) {
		const { data } = await api.post('/Pecas', payload)
		return data
	},

	async atualizar(id, payload) {
		const { data } = await api.put(`/Pecas/${id}`, payload)
		return data
	},

	async remover(id) {
		if (id === undefined || id === null) {
			throw new Error('ID da peça não fornecido para remoção')
		}
		await api.delete(`/Pecas/${id}`)
	}
}

