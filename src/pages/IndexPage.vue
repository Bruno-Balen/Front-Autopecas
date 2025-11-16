<!-- <template>
  <q-page class="flex flex-center">
 
  </q-page>
</template>

<script setup>

</script> -->
<template>
  <q-page class="q-pa-lg bg-grey-1">
    <!-- Greeting -->
    <div class="q-mb-lg">
      <div class="text-h5 text-weight-bold">Ola {{ nomeUsuario }} 👋</div>
    </div>

    <!-- Cards de Totais -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="card-total">
          <q-card-section class="q-pa-md">
            <div class="row items-center">
              <div class="col-auto">
                <q-avatar
                  icon="people"
                  color="teal"
                  text-color="white"
                  size="lg"
                />
              </div>
              <div class="col q-ml-md">
                <div class="text-caption text-grey-7">Total de clientes</div>
                <div class="text-h6 text-weight-bold">{{ totalClientes }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="card-total">
          <q-card-section class="q-pa-md">
            <div class="row items-center">
              <div class="col-auto">
                <q-avatar
                  icon="business"
                  color="orange"
                  text-color="white"
                  size="lg"
                />
              </div>
              <div class="col q-ml-md">
                <div class="text-caption text-grey-7">Total de fornecedores</div>
                <div class="text-h6 text-weight-bold">{{ totalFornecedores }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="card-total">
          <q-card-section class="q-pa-md">
            <div class="row items-center">
              <div class="col-auto">
                <q-avatar
                  icon="inventory"
                  color="blue"
                  text-color="white"
                  size="lg"
                />
              </div>
              <div class="col q-ml-md">
                <div class="text-caption text-grey-7">Total de peças</div>
                <div class="text-h6 text-weight-bold">{{ totalPecas }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="card-total">
          <q-card-section class="q-pa-md">
            <div class="row items-center">
              <div class="col-auto">
                <q-avatar
                  icon="shopping_cart"
                  color="green"
                  text-color="white"
                  size="lg"
                />
              </div>
              <div class="col q-ml-md">
                <div class="text-caption text-grey-7">Total de compras</div>
                <div class="text-h6 text-weight-bold">{{ totalCompras }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Top Peças -->
    <div class="row q-col-gutter-md">
      <div class="col-12 col-lg-6">
        <q-card class="chart-card">
          <q-card-section class="bg-grey-8 text-white q-pa-md">
            <div class="text-subtitle2 text-weight-bold">Top peças mais vendidas</div>
          </q-card-section>
          <q-card-section class="q-pa-md">
            <div v-for="(item, idx) in topPecas" :key="idx" class="q-mb-md">
              <div class="row items-center q-mb-xs">
                <div class="col-auto text-caption text-weight-bold text-grey-7" style="min-width: 20px">{{ idx + 1 }}</div>
                <div class="col-auto text-caption" style="min-width: 100px">{{ item.nome }}</div>
                <div class="col"></div>
                <div class="col-auto text-caption text-weight-bold">{{ item.vendas }}%</div>
              </div>
              <div class="bar-container">
                <div class="bar" :style="{ width: item.vendas + '%', backgroundColor: item.cor }"></div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Top Categorias -->
      <div class="col-12 col-lg-6">
        <q-card class="chart-card">
          <q-card-section class="bg-grey-8 text-white q-pa-md">
            <div class="text-subtitle2 text-weight-bold">Top categorias mais vendidas</div>
          </q-card-section>
          <q-card-section class="q-pa-md">
            <div v-for="(item, idx) in topCategorias" :key="idx" class="q-mb-md">
              <div class="row items-center q-mb-xs">
                <div class="col-auto text-caption text-weight-bold text-grey-7" style="min-width: 20px">{{ idx + 1 }}</div>
                <div class="col-auto text-caption" style="min-width: 100px">{{ item.nome }}</div>
                <div class="col"></div>
                <div class="col-auto text-caption text-weight-bold">{{ item.vendas }}%</div>
              </div>
              <div class="bar-container">
                <div class="bar" :style="{ width: item.vendas + '%', backgroundColor: item.cor }"></div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useClientesStore } from 'stores/clientesStore'
import { useFornecedoresStore } from 'stores/fornecedoresStore'
import { usePecasStore } from 'stores/pecasStore'
import { useComprasStore } from 'stores/comprasStore'
import { useDashboardStore } from 'stores/dashboardStore'

const clientesStore = useClientesStore()
const fornecedoresStore = useFornecedoresStore()
const pecasStore = usePecasStore()
const comprasStore = useComprasStore()
const dashboardStore = useDashboardStore()

const nomeUsuario = ref('fulano')

onMounted(async () => {
  await Promise.all([
    clientesStore.carregarClientes(),
    fornecedoresStore.carregarFornecedores(),
    pecasStore.carregarPecas(),
    comprasStore.carregarCompras(),
    dashboardStore.carregarDados()
  ])
  console.log('Dashboard - Dados carregados:', {
    clientes: clientesStore.clientes,
    fornecedores: fornecedoresStore.fornecedores,
    pecas: pecasStore.pecas,
    compras: comprasStore.compras
  })
})

const totalClientes = computed(() => clientesStore.clientes?.length || 0)
const totalFornecedores = computed(() => fornecedoresStore.fornecedores?.length || 0)
const totalPecas = computed(() => pecasStore.pecas?.length || 0)
const totalCompras = computed(() => comprasStore.compras?.length || 0)

const topPecas = computed(() => dashboardStore.topPecas)
const topCategorias = computed(() => dashboardStore.topCategorias)
</script>

<style scoped>
.card-total {
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.card-total:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
}

.chart-card {
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.bar-container {
  width: 100%;
  height: 24px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}
</style>
