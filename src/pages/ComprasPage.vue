<template>
  <q-page class="q-pa-md page-with-footer">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6">Compras</div>
      <q-btn color="orange" label="Novo" @click="novaCompra" />
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
          @update:model-value="ordenarCompras"
        />
      </div>
    </div>

    <q-table
      flat
      bordered
      hide-bottom
      :rows="comprasFiltradas"
      :columns="colunas"
      row-key="id"
      :loading="store.loading"
      loading-label="Carregando compras..."
      no-data-label="Nenhuma compra encontrada"
    >
      <template v-slot:body-cell-acoes="props">
        <q-td align="center">
          <q-btn dense flat icon="visibility" color="primary" @click="verCompra(props.row)" />
          <q-btn dense flat icon="edit" color="secondary" @click="editarCompra(props.row)" />
          <q-btn dense flat icon="delete" color="negative" @click="excluirCompra(props.row)" />
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
import { useComprasStore } from 'stores/comprasStore'

const store = useComprasStore()
const router = useRouter()

const filtro = ref('')
const ordenacao = ref('Nome')
const pagina = ref(1)
const itensPorPagina = 7

const opcoesOrdenacao = ['Nome', 'Data']

const colunas = [
  { name: 'nomeFornecedor', label: 'nomeFornecedor', field: 'nomeFornecedor', align: 'left', sortable: true },
  { name: 'descricao', label: 'Descrição', field: 'descricao', align: 'left' },
  { name: 'data', label: 'Data', field: 'data', align: 'left' },
  { name: 'total', label: 'Total', field: 'total', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' }
]

onMounted(() => {
  store.carregarCompras()
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

const comprasFiltradas = computed(() => {
  let lista = store.compras || []

  if (filtro.value) {
    const txt = filtro.value.toLowerCase()
    lista = lista.filter(c => (
      (c.fornecedor || '').toLowerCase().includes(txt) ||
      (c.descricao || '').toLowerCase().includes(txt)
    ))
  }

  if (ordenacao.value === 'Nome') lista.sort((a, b) => (a.fornecedor || '').localeCompare(b.fornecedor || ''))
  if (ordenacao.value === 'Data') lista.sort((a, b) => (a.data || '').localeCompare(b.data || ''))

  const inicio = (pagina.value - 1) * itensPorPagina
  return lista.slice(inicio, inicio + itensPorPagina)
})

const paginasTotais = computed(() => Math.ceil((store.compras || []).length / itensPorPagina))

const totalItems = computed(() => (store.compras || []).length)
const inicio = computed(() => Math.min((pagina.value - 1) * itensPorPagina + 1, totalItems.value || 1))
const fim = computed(() => Math.min(pagina.value * itensPorPagina, totalItems.value))

function aplicarFiltro() { pagina.value = 1 }
function ordenarCompras() { pagina.value = 1 }

function novaCompra() { router.push('/app/compras/nova') }
function verCompra(c) { router.push(`/app/compras/${c.id}`) }
function editarCompra(c) { router.push(`/app/compras/${c.id}/editar`) }
function excluirCompra(c) { console.log('Excluir compra:', c) }
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
