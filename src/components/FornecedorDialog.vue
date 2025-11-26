<template>
  <q-dialog v-model="internalShow" persistent>
    <q-card style="min-width: 700px; max-width: 900px;">
      <q-card-section class="text-h6">Fornecedor</q-card-section>

      <q-separator />

      <q-card-section>
        <div class="text-subtitle1 q-mb-md">Informações do fornecedor</div>

        <q-form @submit.prevent="onSave" ref="formRef">
          <div class="q-gutter-md row">
            <div class="col-12">
              <q-input dense outlined v-model="form.nome" label="Nome da Empresa *" :rules="[ v => !!v || 'Nome é obrigatório' ]" :disable="readonly" placeholder="Digite o nome da empresa" />
            </div>

            <div class="col-6">
              <q-input dense outlined v-model="form.email" label="Email *" type="email" :disable="readonly" placeholder="exemplo@email.com" />
            </div>

            <div class="col-6">
              <q-input dense outlined v-model="form.telefone" label="Telefone *" :disable="readonly" placeholder="(11) 99999-9999" mask="(##) #####-####" />
            </div>

            <div class="col-12">
              <q-input dense outlined v-model="form.cnpj" label="CNPJ *" :disable="readonly" placeholder="00.000.000/0000-00" mask="##.###.###/####-##" />
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
  fornecedor: { type: Object, default: null },
  readonly: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue', 'save', 'cancel'])

const $q = useQuasar()

const internalShow = ref(props.modelValue)
watch(() => props.modelValue, v => internalShow.value = v)
watch(internalShow, v => emit('update:modelValue', v))

const formRef = ref(null)

const form = reactive({ id: null, nome: '', email: '', telefone: '', cnpj: '' })

watch(() => props.fornecedor, (f) => {
  if (f) {
    form.id = f.id ?? f.idfornecedor ?? null
    form.nome = f.nome ?? f.razao ?? f.nomeEmpresa ?? ''
    form.email = f.email ?? ''
    form.telefone = f.telefone ?? ''
    form.cnpj = f.cnpj ?? f.CNPJ ?? ''
  } else {
    form.id = null; form.nome = ''; form.email = ''; form.telefone = ''; form.cnpj = ''
  }
}, { immediate: true })

function validate() {
  if (!form.nome) { $q.notify({ type: 'negative', message: 'Informe o nome da empresa.' }); return false }
  if (!form.email) { $q.notify({ type: 'negative', message: 'Informe o email.' }); return false }
  if (!form.telefone) { $q.notify({ type: 'negative', message: 'Informe o telefone.' }); return false }
  if (!form.cnpj) { $q.notify({ type: 'negative', message: 'Informe o CNPJ.' }); return false }
  return true
}

function onlyDigits(v) { return v ? String(v).replace(/\D+/g, '') : undefined }

function onSave () {
  if (props.readonly) return
  if (!validate()) return
  const payload = {
    id: form.id,
    nome: form.nome?.trim(),
    email: form.email?.trim(),
    telefone: onlyDigits(form.telefone),
    cnpj: onlyDigits(form.cnpj)
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
