<template>
	<q-page class="q-pa-md page-with-footer">
		<div class="row items-center justify-between q-mb-md">
			<div class="text-h6">Categorias</div>
			<q-btn color="orange" label="Novo" @click="novaCategoria" />
		</div>


		<div class="row q-col-gutter-md q-mb-md">
			<div class="col-6 col-sm-4">
				<q-input
					dense
					filled
					v-model="filtro"
					placeholder="Pesquisar"
					debounce="300"
					@update:model-value="aplicarFiltro"
					prepend-icon="search"
				/>
			</div>
			<div class="col-6 col-sm-4">
				<q-select
					dense
					filled
					v-model="ordenacao"
					:options="opcoesOrdenacao"
					label="Ordenar por"
					@update:model-value="ordenarCategorias"
				/>
			</div>
		</div>


		<q-table
			flat
			bordered
			hide-bottom
			:rows="categoriasFiltradas"
			:columns="colunas"
			row-key="id"
			:loading="store.loading"
			loading-label="Carregando categorias..."
			no-data-label="Nenhuma categoria encontrada"
		>
			<template v-slot:body-cell-acoes="props">
				<q-td align="center">
					<q-btn dense flat icon="visibility" color="primary" @click="verCategoria(props.row)" />
					<q-btn dense flat icon="edit" color="secondary" @click="editarCategoria(props.row)" />
					<q-btn dense flat icon="delete" color="negative" @click="excluirCategoria(props.row)" />
				</q-td>
			</template>
		</q-table>


		<div class="fixed-footer">
				<q-btn class="back-btn" flat color="grey-8" icon="arrow_back" label="Voltar" @click="voltar" />

				<div class="footer-info">
					<span>Mostrando {{ inicio }}–{{ fim }} de {{ totalItems }}</span>
				</div>

				<q-pagination
					v-model="pagina"
					:max="paginasTotais"
					direction-links
					boundary-links
					color="primary"
				/>
			</div>

	</q-page>

</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCategoriasStore } from 'stores/categoriasStore'

const store = useCategoriasStore()
const router = useRouter()

const filtro = ref('')
const ordenacao = ref('Nome')
const pagina = ref(1)
const itensPorPagina = 7

const opcoesOrdenacao = ['Nome']

const colunas = [
	{ name: 'nome', label: 'nome', field: 'nome', align: 'left', sortable: true },
	{ name: 'descricao', label: 'Descrição', field: 'descricao', align: 'left' },
	{ name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' }
]

onMounted(() => {
	store.carregarCategorias()
})

let _ro = null
let mo = null
function updateDrawerWidth() {
	try {
		const drawer = document.querySelector('.q-drawer')
		if (drawer) {
			const w = Math.round(drawer.getBoundingClientRect().width)
			document.documentElement.style.setProperty('--app-drawer-width', `${w}px`)
		} else {
			document.documentElement.style.setProperty('--app-drawer-width', `0px`)
		}
	} catch (e) {
		console.warn('Não foi possível determinar largura do drawer', e)
	}
}

onMounted(() => {
	updateDrawerWidth()
	if (window.ResizeObserver) {
		const drawer = document.querySelector('.q-drawer')
		if (drawer) {
			_ro = new ResizeObserver(updateDrawerWidth)
			_ro.observe(drawer)
		}
	}
	window.addEventListener('resize', updateDrawerWidth)
	mo = new MutationObserver(updateDrawerWidth)
	mo.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class'] })
})

onUnmounted(() => {
	if (_ro && _ro.disconnect) _ro.disconnect()
	window.removeEventListener('resize', updateDrawerWidth)
	try { if (mo && mo.disconnect) mo.disconnect() } catch (err) { console.warn('Erro ao desconectar MutationObserver', err) }
})

const categoriasFiltradas = computed(() => {
	let lista = store.categorias || []

	if (filtro.value) {
		lista = lista.filter(c => (c.categoria || '').toLowerCase().includes(filtro.value.toLowerCase()))
	}

	if (ordenacao.value === 'Nome') lista.sort((a, b) => (a.categoria || '').localeCompare(b.categoria || ''))

	const inicio = (pagina.value - 1) * itensPorPagina
	return lista.slice(inicio, inicio + itensPorPagina)
})

const paginasTotais = computed(() => Math.ceil((store.categorias || []).length / itensPorPagina))

const totalItems = computed(() => (store.categorias || []).length)
const inicio = computed(() => Math.min((pagina.value - 1) * itensPorPagina + 1, totalItems.value || 1))
const fim = computed(() => Math.min(pagina.value * itensPorPagina, totalItems.value))

function aplicarFiltro() { pagina.value = 1 }
function ordenarCategorias() { pagina.value = 1 }

function novaCategoria() { router.push('/app/categorias/nova') }
function verCategoria(cat) { router.push(`/app/categorias/${cat.id}`) }
function editarCategoria(cat) { router.push(`/app/categorias/${cat.id}/editar`) }
function excluirCategoria(cat) { console.log('Excluir categoria:', cat) }
function voltar() { router.back() }
</script>

<style scoped>
.page-with-footer { padding-bottom: 72px; }
.fixed-footer {
	position: fixed;
	bottom: 0;
	left: var(--app-drawer-width, 260px);
	width: calc(100% - var(--app-drawer-width, 260px));
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 12px;
	padding: 10px 16px;
	background: #ffffff;
	border-top: 1px solid rgba(0, 0, 0, 0.08);
	z-index: 1000;
}

.fixed-footer .back-btn {
	background: #fbf3ea;
	border-radius: 8px;
	padding: 8px 18px;
	text-transform: uppercase;
	box-shadow: 0 1px 0 rgba(0,0,0,0.04);
}

.fixed-footer .footer-info {
	flex: 1;
	text-align: center;
	color: rgba(0,0,0,0.7);
	font-size: 14px;
}
@media (max-width: 1024px) {
	.page-with-footer { padding-bottom: 92px; }
	.fixed-footer { left: 0; width: 100%; flex-direction: column; gap: 6px; padding: 12px; }
}
</style>

