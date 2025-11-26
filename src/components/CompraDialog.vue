<template>
  <q-dialog v-model="internalShow" persistent>
    <q-card style="min-width: 800px; max-width: 1100px;">
      <q-card-section class="text-h6">Compra</q-card-section>

      <q-separator />

      <q-card-section>
        <div class="q-gutter-md">
          <q-form @submit.prevent="onSave" ref="formRef">
            <div class="row q-col-gutter-md">
              <div class="col-6">
                <q-select
                  dense
                  outlined
                  label="Fornecedor *"
                  :options="fornecedorOptions"
                  option-label="label"
                  option-value="value"
                  emit-value
                  map-options
                  v-model="form.fornecedorId"
                  :disable="readonly"
                />
              </div>

              <div class="col-6">
                <q-input
                  dense
                  outlined
                  type="text"
                  label="Descrição"
                  v-model="form.descricao"
                  :disable="readonly"
                />
              </div>
            </div>

            <div class="q-mt-md">
              <div class="row items-center justify-between q-mb-sm">
                <div class="text-subtitle1">Itens da compra</div>
                <q-btn dense color="orange" label="Adicionar" icon="add" @click="abrirAdicionarItem" :disable="readonly" />
              </div>

              <div>
                <q-table
                  flat
                  :rows="form.itens"
                  :columns="colunasItens"
                  row-key="_uid"
                >
                  <template v-slot:body-cell-peca="props">
                    <q-td>
                      <div v-if="!readonly">
                        <q-select dense outlined v-model="props.row.pecaId" :options="pecaOptions" option-label="label" option-value="value" emit-value map-options />
                      </div>
                      <div v-else>
                        {{ findPecaLabel(props.row.pecaId) }}
                      </div>
                    </q-td>
                  </template>

                  <template v-slot:body-cell-quantidade="props">
                    <q-td>
                      <q-input dense outlined type="number" v-model.number="props.row.quantidade" :disable="readonly" />
                    </q-td>
                  </template>

                  <template v-slot:body-cell-valorUnitario="props">
                    <q-td>
                      <q-input dense outlined type="number" v-model.number="props.row.valorUnitario" prefix="R$ " :disable="readonly" />
                    </q-td>
                  </template>

                  <template v-slot:body-cell-subtotal="props">
                    <q-td>
                      {{ formatMoney(itemSubtotal(props.row)) }}
                    </q-td>
                  </template>

                  <template v-slot:body-cell-acoes="props">
                    <q-td align="center">
                      <q-btn dense flat icon="delete" color="negative" @click="removerItem(props.row._uid)" v-if="!readonly" />
                    </q-td>
                  </template>
                </q-table>
              </div>

              <div class="row justify-end q-mt-md">
                <div class="text-h6">Total: {{ formatMoney(total) }}</div>
              </div>
            </div>
          </q-form>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="between">
        <div>
          <q-btn flat dense icon="arrow_back" label="Voltar" @click="onCancel" />
        </div>

        <div>
          <q-btn flat dense color="grey-8" icon="disabled_by_default" label="Cancelar" @click="onCancel" class="q-mr-sm" />
          <q-btn v-if="!readonly" color="orange" label="Salvar" @click="onSave" />
        </div>
      </q-card-actions>
    </q-card>

    <q-dialog v-model="addingItem" persistent>
      <q-card style="min-width: 500px; max-width: 700px;">
        <q-card-section class="text-h6">Adicionar Item</q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-6">
              <q-select dense outlined label="Peça" :options="pecaOptions" option-label="label" option-value="value" emit-value map-options v-model="newItem.pecaId" />
            </div>
            <div class="col-3">
              <q-input dense outlined type="number" label="Quantidade" v-model.number="newItem.quantidade" />
            </div>
            <div class="col-3">
              <q-input dense outlined type="number" label="Valor Unitário" v-model.number="newItem.valorUnitario" prefix="R$ " />
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" @click="addingItem = false" />
          <q-btn color="orange" label="Adicionar" @click="confirmAddItem" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { useQuasar } from 'quasar'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  purchase: { type: Object, default: null },
  fornecedores: { type: Array, default: () => [] },
  pecas: { type: Array, default: () => [] },
  readonly: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue', 'save', 'cancel'])

const $q = useQuasar()

const internalShow = ref(props.modelValue)
watch(() => props.modelValue, v => internalShow.value = v)
watch(internalShow, v => emit('update:modelValue', v))

const formRef = ref(null)

const form = reactive({
  id: null,
  fornecedorId: null,
  descricao: '',
  itens: []
})

watch(() => props.fornecedores, () => {
  // noop, options computed
})

watch(() => props.pecas, () => {
  // noop
})

watch(() => props.purchase, (compra) => {
  if (compra && (compra.id || compra.idcompra)) {
    // Editando ou visualizando compra existente
    form.id = compra.idcompra ?? compra.id
    form.fornecedorId = compra.idfornecedor ?? compra.fornecedorId ?? compra.idFornecedor
    form.descricao = compra.descricao || ''
    
    console.log('=== Carregando compra ===', compra)
    console.log('Fornecedor ID:', form.fornecedorId)
    console.log('Itens recebidos:', compra.itens)
    console.log('Itens é array?', Array.isArray(compra.itens))
    console.log('Quantidade de itens:', compra.itens?.length)
    
    // Popular itens
    if (Array.isArray(compra.itens) && compra.itens.length > 0) {
      form.itens = compra.itens.map((item, index) => {
        console.log(`Item ${index} original:`, item)
        const itemFormatado = {
          _uid: makeRowUid(),
          pecaId: item.idpecas ?? item.idpeca ?? item.pecaId ?? item.idPeca,
          quantidade: item.quantidade || 1,
          valorUnitario: item.valorUnitario ?? item.valorunitario ?? item.valor_unitario ?? 0
        }
        console.log(`Item ${index} formatado:`, itemFormatado)
        return itemFormatado
      })
      console.log('Form.itens após mapeamento:', form.itens)
    } else {
      console.log('Nenhum item encontrado ou itens não é array')
      form.itens = []
    }
  } else {
    // Nova compra
    form.id = null
    form.fornecedorId = null
    form.descricao = ''
    form.itens = []
  }
}, { immediate: true })

watch(() => internalShow.value, (v) => {
  if (!v) return
  // reset when opened empty
  if (!props.purchase && !form.fornecedorId && !form.itens.length) {
    form.descricao = ''
  }
})

watch(() => props.modelValue, (v) => {
  if (!v) return
})

const fornecedorOptions = computed(() => {
  const opts = (props.fornecedores || []).map(f => ({ 
    label: f.nome || f.razao || f.nomeFantasia || '', 
    value: f.idfornecedor ?? f.id 
  }))
  console.log('Fornecedor Options:', opts)
  return opts
})

const pecaOptions = computed(() => {
  const opts = (props.pecas || []).map(p => ({ 
    label: p.nome || p.descricao || '', 
    value: p.idpecas ?? p.idpeca ?? p.id 
  }))
  console.log('Peça Options:', opts)
  return opts
})

let uidCounter = 1
function makeRowUid() { return `i_${Date.now()}_${uidCounter++}` }

const colunasItens = [
  { name: 'peca', label: 'Peça', field: 'pecaId' },
  { name: 'quantidade', label: 'Quantidade', field: 'quantidade' },
  { name: 'valorUnitario', label: 'Valor unitário', field: 'valorUnitario' },
  { name: 'subtotal', label: 'Subtotal', field: 'subtotal' },
  { name: 'acoes', label: 'Ações', field: 'acoes' }
]

function abrirAdicionarItem() {
  newItem.pecaId = null
  newItem.quantidade = 1
  newItem.valorUnitario = 0
  addingItem.value = true
}

const addingItem = ref(false)
const newItem = reactive({ pecaId: null, quantidade: 1, valorUnitario: 0 })

function confirmAddItem() {
  if (!newItem.pecaId) { $q.notify({ type: 'negative', message: 'Selecione uma peça.' }); return }
  const row = { _uid: makeRowUid(), pecaId: newItem.pecaId, quantidade: newItem.quantidade || 1, valorUnitario: Number(newItem.valorUnitario || 0) }
  form.itens.push(row)
  addingItem.value = false
}

function removerItem(uid) {
  const idx = form.itens.findIndex(i => i._uid === uid)
  if (idx !== -1) form.itens.splice(idx, 1)
}

function itemSubtotal(row) {
  return (Number(row.quantidade || 0) * Number(row.valorUnitario || 0))
}

const total = computed(() => form.itens.reduce((s, it) => s + itemSubtotal(it), 0))

function formatMoney(v) { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(v || 0)) }

function findPecaLabel(id) {
  const found = (props.pecas || []).find(p => (p.idpecas ?? p.idpeca ?? p.id) === id)
  return found ? (found.nome || found.descricao || '') : ''
}

function validate() {
  if (!form.fornecedorId) { $q.notify({ type: 'negative', message: 'Selecione um fornecedor.' }); return false }
  if (!form.itens.length) { $q.notify({ type: 'negative', message: 'Adicione pelo menos um item.' }); return false }
  return true
}

function onSave() {
  if (props.readonly) return
  if (!validate()) return
  const payload = {
    id: form.id,
    fornecedorId: form.fornecedorId,
    descricao: form.descricao?.trim(),
    itens: form.itens.map(i => ({ pecaId: i.pecaId, quantidade: Number(i.quantidade), valorUnitario: Number(i.valorUnitario) })),
    total: Number(total.value)
  }
  emit('save', payload)
  internalShow.value = false
}

function onCancel() {
  emit('cancel')
  internalShow.value = false
}

// expose a small API to reset/populate the form from parent if needed
defineExpose({ form, reset: () => { form.fornecedorId = null; form.descricao = ''; form.itens = [] } })
</script>

<style scoped>
.text-subtitle1 { font-weight: 600 }
</style>
