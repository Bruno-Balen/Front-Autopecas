<template>
  <q-page class="q-pa-md page-with-footer bg-white">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h6 text-bold">Clientes</div>
      </div>

      <q-btn color="orange" label="Novo" @click="novoCliente" class="q-px-lg" />
    </div>

    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-6 col-md-3">
        <q-input
          dense
          outlined
          v-model="filtro"
          placeholder="Pesquisar"
          clearable
          prepend-inner-icon="search"
        />
      </div>

      <div class="col-6 col-md-3">
        <q-select
          dense
          outlined
          v-model="ordenarPor"
          :options="opcoesOrdenar"
          label="Ordenar por"
        />
      </div>
    </div>

    <q-table
      :rows="clientesFiltrados"
      :columns="colunas"
      row-key="id"
      flat
      bordered
      hide-bottom
      :rows-per-page="itensPorPagina"
      class="shadow-1"
    >
      <template v-slot:body-cell-acoes="props">
        <q-td align="center">
          <q-btn flat round icon="visibility" @click="verCliente(props.row)" />
          <q-btn flat round icon="edit" color="primary" @click="editarCliente(props.row)" />
          <q-btn flat round icon="delete" color="negative" @click="excluirCliente(props.row)" />
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
        :max="maxPaginas"
        color="primary"
        direction-links
        boundary-links
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useClientesStore } from 'stores/clientesStore'

const store = useClientesStore()
const router = useRouter()

const filtro = ref('')
const ordenarPor = ref('Nome')
const pagina = ref(1)
const itensPorPagina = 7

const opcoesOrdenar = ['Nome', 'Cidade', 'Email']

const colunas = [
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  { name: 'telefone', label: 'Telefone', field: 'telefone', align: 'left' },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
  { name: 'cidade', label: 'Cidade', field: 'cidade', align: 'left' },
  { name: 'acoes', label: 'Ações', align: 'center' }
]

onMounted(() => {
  store.carregarClientes()
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
  } catch (e) { console.warn('Não foi possível determinar largura do drawer', e) }
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

const clientesFiltrados = computed(() => {
  let lista = store.clientes || []

  if (filtro.value) {
    const txt = filtro.value.toLowerCase()
    lista = lista.filter(c => (
      (c.nome || '').toLowerCase().includes(txt) ||
      (c.email || '').toLowerCase().includes(txt) ||
      (c.cidade || '').toLowerCase().includes(txt)
    ))
  }

  if (ordenarPor.value === 'Nome') lista.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''))
  if (ordenarPor.value === 'Cidade') lista.sort((a, b) => (a.cidade || '').localeCompare(b.cidade || ''))
  if (ordenarPor.value === 'Email') lista.sort((a, b) => (a.email || '').localeCompare(b.email || ''))

  const inicio = (pagina.value - 1) * itensPorPagina
  return lista.slice(inicio, inicio + itensPorPagina)
})

const maxPaginas = computed(() => Math.ceil((store.clientes || []).length / itensPorPagina))

const totalItems = computed(() => (store.clientes || []).length)
const inicio = computed(() => Math.min((pagina.value - 1) * itensPorPagina + 1, totalItems.value || 1))
const fim = computed(() => Math.min(pagina.value * itensPorPagina, totalItems.value))

function novoCliente() { router.push('/app/clientes/nova') }
function verCliente(c) { router.push(`/app/clientes/${c.id}`) }
function editarCliente(c) { router.push(`/app/clientes/${c.id}/editar`) }
function excluirCliente(c) { console.log('Excluir cliente:', c) }
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
@media (max-width: 1024px) {
  .page-with-footer { padding-bottom: 92px; }
  .fixed-footer { left: 0; width: 100%; flex-direction: column; gap: 6px; padding: 12px; }
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
</style>
