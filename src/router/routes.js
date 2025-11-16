const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', component: () => import('pages/LoginPg.vue') }
    ]
  },
  {
    path: '/app',
    component: () => import('layouts/MainLayout.vue'),
    children: [
  { path: 'home', component: () => import('pages/IndexPage.vue')},
  { path: 'pecas', component: () => import('pages/PecasPg.vue')},
  { path: 'categorias', component: () => import('pages/CategoriaPage.vue')},
  { path: 'fornecedores', component: () => import('pages/FornecedorPage.vue')},
  { path: 'clientes', component: () => import('pages/ClientePage.vue')},
  { path: 'compras', component: () => import('pages/ComprasPage.vue')}

    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
