import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/store/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: {
        auth: true
      }
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: () => import('../views/TransactionsView.vue'),
      meta: {
        auth: true
      }
    },
    {
      path: '/actives',
      name: 'actives',
      component: () => import('../views/ActivesView.vue'),
      meta: {
        auth: true
      }
    },
    {
      path: '/wallet',
      name: 'wallet',
      component: () => import('../views/WalletView.vue'),
      meta: {
        auth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  if (to.meta?.auth) {
    const auth = useAuth()
    if (auth.token && auth.user) {
      const isAuthenticated = await auth.checkToken()
      // console.log(isAuthenticated)
      if (isAuthenticated) {
        next()
      } else {
        next({ name: 'login' })
      }
    } else {
      next({ name: 'login' })
    }
  } else {
    next()
  }
})

export default router
