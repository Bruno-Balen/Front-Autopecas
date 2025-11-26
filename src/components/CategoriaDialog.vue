<template>
  <q-dialog v-model="internalShow" persistent>
    <q-card style="min-width: 600px; max-width: 760px;">
      <q-card-section class="text-h6">Categoria</q-card-section>

      <q-separator />

      <q-card-section>
        <div class="text-subtitle1 q-mb-md">Informações da categoria</div>

        <q-form @submit.prevent="onSave" ref="formRef">
          <div class="q-gutter-md row">
            <div class="col-12">
              <q-input dense outlined v-model="form.nome" label="Nome da categoria *" :rules="[ val => !!val || 'Nome é obrigatório' ]" :disable="readonly" placeholder="Digite o nome da categoria" />
            </div>

            <div class="col-12">
              <q-input dense outlined v-model="form.descricao" label="Descrição *" type="textarea" :disable="readonly" placeholder="Descreva o propósito e características desta categoria" />
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
import { ref, reactive, watch } from 'vue'
import { useQuasar } from 'quasar'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  category: { type: Object, default: null },
  readonly: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue', 'save', 'cancel'])

const $q = useQuasar()

const internalShow = ref(props.modelValue)
watch(() => props.modelValue, v => internalShow.value = v)
watch(internalShow, v => emit('update:modelValue', v))

const formRef = ref(null)

const form = reactive({ id: null, nome: '', descricao: '' })

watch(() => props.category, (c) => {
  if (c) {
    form.id = c.id ?? c.idCategoria ?? c.idcategoria ?? null
    form.nome = c.categoria ?? c.nome ?? ''
    form.descricao = c.descricao ?? c.descricaoCategoria ?? ''
  } else {
    form.id = null; form.nome = ''; form.descricao = ''
  }
}, { immediate: true })

function validate() {
  if (!form.nome) { $q.notify({ type: 'negative', message: 'Informe o nome da categoria.' }); return false }
  if (!form.descricao) { $q.notify({ type: 'negative', message: 'Informe a descrição.' }); return false }
  return true
}

function onSave () {
  if (props.readonly) return
  if (!validate()) return
  const payload = { ...form }
  emit('save', payload)
  internalShow.value = false
}

function onCancel () {
  emit('cancel')
  internalShow.value = false
}
</script>

<style scoped>
.q-card-section { background: transparent }
.text-subtitle1 { font-weight: 600 }
.q-field--readonly .q-field__control {
  cursor: not-allowed !important;
}
.q-field--disabled .q-field__control {
  cursor: not-allowed !important;
}
</style>
