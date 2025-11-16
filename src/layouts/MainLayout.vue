<template>
  <q-layout view="lHh Lpr lFf">
    <!-- CABEÇALHO PADRÃO DO QUASAR -->
    <q-header elevated class="app-header">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>Meu Sistema</q-toolbar-title>
      </q-toolbar>
    </q-header>


    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="menu-drawer">
      <div class="menu-container">

        <div class="menu-header q-pa-md flex items-center justify-between">
          <div class="text-h6 text-bold">Início</div>
        </div>

  
        <q-list padding class="q-mt-md">
          <q-item
            v-for="item in menu"
            :key="item.to"
            clickable
            @click.stop="navigate(item.to)"
            class="q-my-xs"
            :class="{ 'active-menu-item': route.path === item.to }"
          >
            <q-item-section avatar>
              <q-icon :name="item.icon" size="24px" />
            </q-item-section>

            <q-item-section class="text-body1">
              {{ item.label }}
            </q-item-section>

            <q-item-section side>
              <q-icon name="chevron_right" />
            </q-item-section>
          </q-item>
        </q-list>

        <div class="logout-container q-pa-md q-mt-auto">
          <q-btn
            label="Sair"
            color="orange"
            unelevated
            class="full-width text-white logout-btn"
            @click="logout"
          />
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'


const leftDrawerOpen = ref(false)
const route = useRoute()
const router = useRouter()

const menu = [
  { label: 'Início', icon: 'home', to: '/app/home' },
  { label: 'Peças', icon: 'build', to: '/app/pecas' },
  { label: 'Clientes', icon: 'people', to: '/app/clientes' },
  { label: 'Categorias', icon: 'category', to: '/app/categorias' },
  { label: 'Compras', icon: 'shopping_cart', to: '/app/compras' },
  { label: 'Fornecedores', icon: 'local_shipping', to: '/app/fornecedores' }
]

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function logout() {
  
  router.push('/login')
}

function navigate(to) {
  if (!to) return

  const target = typeof to === 'string' ? { path: to } : to
  console.log('Navegar para', target)

  router.push(target)
    .catch(err => {
      console.error('Falha ao navegar para', target, err)
    })
    .catch(err => {
      console.error('Falha ao navegar para', target, err)
    })
}

</script>

<style scoped>
.menu-drawer {
  width: 260px;
  display: flex;
  flex-direction: column;
}

.menu-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.menu-header {
  border-bottom: 1px solid #f1f1f1;
}

.active-menu-item {
  background-color:  #f59e0b;
  color: white;
  border-radius: 8px;
  margin: 4px 8px;
}

.logout-container {
  margin-top: auto;
}

.logout-btn {
  font-weight: bold;
  border-radius: 8px;
}

.app-header {
  background-color: #f59e0b;
  color: #fff;
}

.app-header .q-toolbar__title,
.app-header .q-btn,
.app-header .q-icon,
.app-header .q-toolbar div {
  color: #fff !important;
}
</style>
