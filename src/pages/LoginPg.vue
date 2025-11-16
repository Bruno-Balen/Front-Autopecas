<template>
  <div class="login-page row no-wrap shadow-4">
    <div class="left q-pa-xl bg-grey-2 flex column justify-center">
      <q-card flat class="full-width">
        <q-card-section>
          <div class="text-h5 text-bold q-mb-md">Login</div>

          <q-input
            v-model="email"
            label="Email"
            type="email"
            outlined
            dense
            class="q-mb-md"
          />

          <q-input
            v-model="password"
            label="Senha"
            type="password"
            outlined
            dense
            class="q-mb-md"
          />

          <div class="row items-center q-mb-md">
            <q-checkbox v-model="remember" label="Lembrar de mim" dense />
          </div>

          <q-btn
            label="Login"
            color="orange"
            unelevated
            class="full-width text-white"
            @click="fazerLogin"
          />
        </q-card-section>
      </q-card>
    </div>

    <div
      class="right flex flex-center text-h4 text-bold"
      style="background: linear-gradient(to bottom right, #f5e1d3, #f2caa3);"
    >
      Bem-vindo!
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const remember = ref(false)

const router = useRouter()

function fazerLogin() {
  router.push('/app/home')
}
</script>

<style scoped>
.login-page {
  width: 100vw;
  height: 100vh;
  border-radius: 0;
  overflow: hidden;
}

.left {
  width: 40%;
  min-width: 300px;
}

.right {
  flex: 1;
}
</style>
