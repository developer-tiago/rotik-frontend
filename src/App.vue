<template>
  <header v-if="auth.isAuthenticated">
    <RouterLink to="/" title="Dashboard" class="me-2">
      <i class="ri-home-line"></i>
    </RouterLink>
    <span>Olá, {{ auth.userLogged.name }}</span>

    <RouterLink to="/actives" title="Ações" class="ms-auto">
      <i class="ri-stock-line"></i>
    </RouterLink>

    <RouterLink to="/transactions" title="Minhas transações" class="ms-2">
      <i class="ri-file-list-3-line"></i>
    </RouterLink>
    <RouterLink to="wallet" title="Minha carteira" class="mx-2">
      <i class="ri-wallet-line"></i>
    </RouterLink>
    <button @click="logout()" title="Sair da conta" class="ms-3">
      <i class="ri-logout-box-line"></i>
    </button>
  </header>

  <RouterView />
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useAuth } from '@/store/auth'

const auth = useAuth()

function logout() {
  auth.clear()
}
</script>

<style lang="scss" scoped>
header {
  display: flex;
  align-items: center;
  justify-content: end;

  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
  border-radius: 10px;

  padding: 20px;
  margin: 10px 10px 0px;

  a,
  button {
    text-decoration: none;
    border-radius: 8px;
    padding: 2px 6px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);

    i {
      color: #000;
    }
  }

  button {
    border: none;
  }
}
</style>
