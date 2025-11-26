<template>
  <q-dialog v-model="internalShow" persistent>
    <q-card style="min-width: 640px; max-width: 900px">
      <q-card-section class="text-h6">Peça</q-card-section>

      <q-separator />

      <q-card-section>
        <div class="text-subtitle1 q-mb-md">Informações da peça</div>

        <q-form @submit.prevent="onSave" ref="formRef">
          <div class="q-gutter-md row">
            <div class="col-12">
              <q-input dense outlined v-model="form.nome" label="Nome da peça *" :rules="[ v => !!v || 'Nome é obrigatório' ]" :disable="readonly" placeholder="Digite o nome da peça" />
            </div>

            <div class="col-12">
              <q-input dense outlined v-model="form.descricao" label="Descrição *" type="textarea" :disable="readonly" placeholder="Descreva as características e especificações da peça" />
            </div>

            <div class="col-6">
              <q-input dense outlined v-model="form.marca" label="Marca *" :disable="readonly" placeholder="Digite a marca da peça" />
            </div>

            <div class="col-6">
              <q-select dense outlined v-model="form.categoriaId" :options="categoriaOptions" label="Categoria *" :disable="readonly" option-label="label" option-value="value" emit-value map-options placeholder="Selecione a categoria da peça" />
            </div>
          </div>
        </q-form>
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
  </q-dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { useQuasar } from 'quasar'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  piece: { type: Object, default: null },
  readonly: { type: Boolean, default: false },
  categories: { type: Array, default: () => [] }
})
const emit = defineEmits(['update:modelValue', 'save', 'cancel'])

const $q = useQuasar()

const internalShow = ref(props.modelValue)
watch(() => props.modelValue, v => internalShow.value = v)
watch(internalShow, v => emit('update:modelValue', v))

const formRef = ref(null)

const form = reactive({ id: null, nome: '', descricao: '', marca: '', categoriaId: null })

watch(() => props.piece, (p) => {
  if (p) {
    form.id = p.id ?? p.idpeca ?? p.idpecas ?? null
    form.nome = p.nome ?? p.name ?? ''
    form.descricao = p.descricao ?? p.description ?? ''
    form.marca = p.marca ?? p.marcapeca ?? ''
    const catId = p.idcategoria ?? p.categoriaId ?? p.categoria?.id ?? p.idCategoria ?? null
    
    if (catId && props.categories) {
      const cat = props.categories.find(c => (c.idcategoria ?? c.id) === catId)
      form.categoriaId = cat ? cat.id : catId
    } else {
      form.categoriaId = catId
    }
    
    console.log('Peça carregada:', p)
    console.log('idcategoria da API:', catId)
    console.log('CategoriaId mapeado para form:', form.categoriaId)
  } else {
    form.id = null; form.nome = ''; form.descricao = ''; form.marca = ''; form.categoriaId = null
  }
}, { immediate: true })

const categoriaOptions = computed(() => {
  const opts = (props.categories || []).map(c => {
    const label = c.categoria || c.nome || c.description || ''
    const value = c.id
    console.log('Categoria:', { label, value, original: c })
    return { label, value }
  })
  console.log('Categoria Options final:', opts)
  console.log('Form categoriaId atual:', form.categoriaId)
  return opts
})

function validate() {
  if (!form.nome) { $q.notify({ type: 'negative', message: 'Informe o nome da peça.' }); return false }
  if (!form.descricao) { $q.notify({ type: 'negative', message: 'Informe a descrição.' }); return false }
  if (!form.marca) { $q.notify({ type: 'negative', message: 'Informe a marca.' }); return false }
  if (!form.categoriaId) { $q.notify({ type: 'negative', message: 'Selecione a categoria.' }); return false }
  return true
}

function onSave () {
  if (props.readonly) return
  if (!validate()) return
  const payload = { 
    id: form.id, 
    nome: form.nome?.trim(), 
    descricao: form.descricao?.trim(), 
    marca: form.marca?.trim(), 
    idcategoria: form.categoriaId,
    disponivel: true
  }
  emit('save', payload)
  internalShow.value = false
}

function onCancel () {
  emit('cancel')
  internalShow.value = false
}
</script>

<style scoped>
.text-subtitle1 { font-weight: 600 }
.q-field--readonly .q-field__control {
  cursor: not-allowed !important;
}
.q-field--disabled .q-field__control {
  cursor: not-allowed !important;
}
</style>
