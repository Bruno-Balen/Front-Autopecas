<template>
  <q-page padding class="bg-white">
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

    <div class="row justify-between items-center q-mt-md">
      <q-btn flat color="black" icon="arrow_back" label="Voltar" @click="voltar" />
      <q-pagination
        v-model="pagina"
        :max="maxPaginas"
        color="purple"
        boundary-numbers
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'

const filtro = ref('')
const ordenarPor = ref('Nome')
const pagina = ref(1)
const maxPaginas = 40

const opcoesOrdenar = ['Nome', 'Cidade', 'Email']

const clientes = ref([
  { id: 1, nome: 'Jane Cooper', telefone: '(225) 555-0118', email: 'jane@microsoft.com', cidade: 'Chapecó' },
  { id: 2, nome: 'Floyd Miles', telefone: '(205) 555-0100', email: 'floyd@yahoo.com', cidade: 'Nova Itaberaba' },
  { id: 3, nome: 'Ronald Richards', telefone: '(302) 555-0107', email: 'ronald@adobe.com', cidade: 'Nova Erechim' },
  { id: 4, nome: 'Marvin McKinney', telefone: '(252) 555-0126', email: 'marvin@tesla.com', cidade: 'Pinhalzinho' },
  { id: 5, nome: 'Jerome Bell', telefone: '(629) 555-0129', email: 'jerome@google.com', cidade: 'Chapecó' },
  { id: 6, nome: 'Kathryn Murphy', telefone: '(406) 555-0120', email: 'kathryn@microsoft.com', cidade: 'Joaçaba' },
  { id: 7, nome: 'Jacob Jones', telefone: '(208) 555-0112', email: 'jacob@yahoo.com', cidade: 'Concórdia' }
])

const colunas = [
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  { name: 'telefone', label: 'Telefone', field: 'telefone', align: 'left' },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
  { name: 'cidade', label: 'Cidade', field: 'cidade', align: 'left' },
  { name: 'acoes', label: 'Ações', align: 'center' }
]

const clientesFiltrados = computed(() => {
  return clientes.value.filter(c =>
    c.nome.toLowerCase().includes(filtro.value.toLowerCase())
  )
})

function novoCliente() {
 
  console.log('Novo cliente')
}

function verCliente(c) {
  console.log('Ver cliente', c)
}

function editarCliente(c) {
  console.log('Editar cliente', c)
}

function excluirCliente(c) {
  console.log('Excluir cliente', c)
}

function voltar() {
  console.log('Voltar')
}
</script>
