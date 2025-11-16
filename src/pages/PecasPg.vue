<template>
  <q-page class="q-pa-md page-with-footer">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6">Peças</div>
      <q-btn color="orange" label="Novo" @click="novaPeca" />
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
          @update:model-value="ordenarPecas"
        />
      </div>
    </div>

 
    <q-table
      flat
      bordered
      hide-bottom
      :rows="pecasFiltradas"
      :columns="colunas"
      row-key="id"
      :loading="store.loading"
      loading-label="Carregando peças..."
      no-data-label="Nenhuma peça encontrada"
    >
      <template v-slot:body-cell-acoes="props">
        <q-td align="center">
          <q-btn dense flat icon="visibility" color="primary" @click="verPeca(props.row)" />
          <q-btn dense flat icon="edit" color="secondary" @click="editarPeca(props.row)" />
          <q-btn dense flat icon="delete" color="negative" @click="excluirPeca(props.row)" />
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
import { usePecasStore } from 'stores/pecasStore'

const store = usePecasStore()
const router = useRouter()

const filtro = ref('')
const ordenacao = ref('Nome')
const pagina = ref(1)
const itensPorPagina = 7

const opcoesOrdenacao = ['Nome', 'Marca', 'Categoria']

const colunas = [
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  { name: 'marca', label: 'Marca', field: 'marca', align: 'left', sortable: true },
  { name: 'categoria', label: 'Categoria', field: 'categoria', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' }
]

onMounted(() => {
  store.carregarPecas()
})

// Ajusta a variável CSS --app-drawer-width conforme a largura do drawer
let _ro = null
let mo = null
function updateDrawerWidth() {
  try {
    const drawer = document.querySelector('.q-drawer')
    if (drawer) {
      const w = Math.round(drawer.getBoundingClientRect().width)
      document.documentElement.style.setProperty('--app-drawer-width', `${w}px`)
    } else {
      // se não encontrar, zera o deslocamento
      document.documentElement.style.setProperty('--app-drawer-width', `0px`)
    }
  } catch (e) {
    console.warn('Não foi possível determinar largura do drawer', e)
  }
}

onMounted(() => {
  // atualiza inicialmente
  updateDrawerWidth()

  // usa ResizeObserver quando disponível para reagir a mudanças de largura
  if (window.ResizeObserver) {
    const drawer = document.querySelector('.q-drawer')
    if (drawer) {
      _ro = new ResizeObserver(updateDrawerWidth)
      _ro.observe(drawer)
    }
  }

  // fallback: atualiza ao redimensionar a janela (ou quando o drawer é aberto/fechado)
  window.addEventListener('resize', updateDrawerWidth)
  // também observe mutações no body, caso o Quasar altere classes (mini, etc.)
  mo = new MutationObserver(updateDrawerWidth)
  mo.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class'] })
})

onUnmounted(() => {
  if (_ro && _ro.disconnect) _ro.disconnect()
  window.removeEventListener('resize', updateDrawerWidth)
  try {
    if (mo && mo.disconnect) mo.disconnect()
  } catch (err) {
    console.warn('Erro ao desconectar MutationObserver', err)
  }
})

const pecasFiltradas = computed(() => {
  let lista = store.pecas

  if (filtro.value) {
    lista = lista.filter(p =>
      p.nome.toLowerCase().includes(filtro.value.toLowerCase())
    )
  }

  if (ordenacao.value === 'Nome') lista.sort((a, b) => a.nome.localeCompare(b.nome))
  if (ordenacao.value === 'Marca') lista.sort((a, b) => a.marca.localeCompare(b.marca))
  if (ordenacao.value === 'Categoria') lista.sort((a, b) => a.categoria.localeCompare(b.categoria))

  const inicio = (pagina.value - 1) * itensPorPagina
  return lista.slice(inicio, inicio + itensPorPagina)
})

const paginasTotais = computed(() => Math.ceil(store.pecas.length / itensPorPagina))

const totalItems = computed(() => store.pecas.length)
const inicio = computed(() => Math.min((pagina.value - 1) * itensPorPagina + 1, totalItems.value || 1))
const fim = computed(() => Math.min(pagina.value * itensPorPagina, totalItems.value))


function aplicarFiltro() {
  pagina.value = 1
}

function ordenarPecas() {
  pagina.value = 1
}

function novaPeca() {
  router.push('/app/pecas/nova')
}

function verPeca(peca) {
  router.push(`/app/pecas/${peca.id}`)
}

function editarPeca(peca) {
  router.push(`/app/pecas/${peca.id}/editar`)
}

function excluirPeca(peca) {

  console.log('Excluir peça:', peca)
}

function voltar() {
  router.back()
}
</script>

<style scoped>
.page-with-footer {
  /* espaço para o rodapé fixo */
  padding-bottom: 72px;
}

/* O footer interno do QTable foi removido via prop `hide-bottom`. */

.fixed-footer {
  position: fixed;
  bottom: 0;
  /* desloca o rodapé para não sobrepor o menu lateral.
     usa uma variável com fallback para a largura do drawer */
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
  background: #fbf3ea; /* tom bege suave */
  border-radius: 8px;
  padding: 8px 18px;
  text-transform: uppercase;
  box-shadow: 0 1px 0 rgba(0,0,0,0.04);
}

.fixed-footer .footer-info {
  flex: 1; /* ocupa espaço entre os botões */
  text-align: center;
  color: rgba(0,0,0,0.7);
  font-size: 14px;
}

@media (max-width: 1024px) {
  /* em telas menores (drawer costuma ficar sobreposto), ocupa toda a largura */
  .page-with-footer { padding-bottom: 92px; }
  .fixed-footer { left: 0; width: 100%; flex-direction: column; gap: 6px; padding: 12px; }
}
</style>
