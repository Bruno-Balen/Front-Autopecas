<template>
  <q-dialog v-model="internalShow" persistent>
    <q-card style="min-width: 760px; max-width: 900px;">
      <q-card-section class="text-h6">Clientes</q-card-section>

      <q-separator />

      <q-card-section>
        <div class="text-subtitle1 q-mb-md">Informações do cliente</div>

        <q-form @submit.prevent="onSave" ref="formRef">
          <div class="q-gutter-md row">
            <div class="col-12">
              <q-input dense outlined v-model="form.nome" label="Nome completo *" :rules="[ val => !!val || 'Nome é obrigatório' ]" />
            </div>

            <div class="col-6">
              <q-input dense outlined v-model="form.email" label="Email *" type="email" :rules="[ val => !!val || 'Email é obrigatório' ]" placeholder="exemplo@email.com" />
            </div>

            <div class="col-6">
              <q-input dense outlined v-model="form.telefone" label="Telefone *" placeholder="(11) 99999-9999" mask="(##) #####-####" />
            </div>

            <div class="col-6">
              <q-input dense outlined v-model="form.dataNascimento" label="Data de nascimento *" placeholder="dd / mm / aaaa" mask="##/##/####" />
            </div>

            <div class="col-6">
              <q-input dense outlined v-model="form.cpf" label="CPF *" placeholder="000.000.000-00" mask="###.###.###-##" />
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
          <q-btn color="orange" label="Salvar" @click="onSave" />
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
  client: { type: Object, default: null }
})
const emit = defineEmits(['update:modelValue', 'save', 'cancel'])

const $q = useQuasar()

const internalShow = ref(props.modelValue)
watch(() => props.modelValue, v => internalShow.value = v)
watch(internalShow, v => emit('update:modelValue', v))

const formRef = ref(null)

const form = reactive({
  id: null,
  nome: '',
  email: '',
  telefone: '',
  dataNascimento: '',
  cpf: ''
})

watch(() => props.client, (c) => {
  if (c) {
    form.id = c.id ?? c.idcliente ?? null
    form.nome = c.nome ?? ''
    form.email = c.email ?? ''
    form.telefone = c.telefone ?? ''
    form.dataNascimento = c.dataNascimento ?? c.dataNascimentoString ?? ''
    form.cpf = c.cpf ?? ''
  } else {
    form.id = null; form.nome = ''; form.email = ''; form.telefone = ''; form.dataNascimento = ''; form.cpf = ''
  }
}, { immediate: true })

function validate() {
  if (!form.nome) { $q.notify({ type: 'negative', message: 'Informe o nome.' }); return false }
  if (!form.email) { $q.notify({ type: 'negative', message: 'Informe o email.' }); return false }
  return true
}

async function onSave () {
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
</style>
