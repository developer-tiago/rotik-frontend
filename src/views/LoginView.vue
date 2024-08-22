<template>
  <main>
    <div class="container">
      <form @submit.prevent="login" class="d-flex flex-column align-items-center">
        <h1>Faça seu login</h1>
        <input class="mb-2" type="text" placeholder="Seu email" v-model="user.email" />
        <input type="password" placeholder="Sua senha" v-model="user.password" />
        <button type="submit">Login</button>
        <RouterLink to="/register"> Criar conta</RouterLink>
      </form>
    </div>
  </main>
</template>

<script setup>
import http from '@/services/index'
import { reactive } from 'vue'
import { useAuth } from '@/store/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = useAuth()

const user = reactive({
  email: '',
  password: ''
})

async function login() {
  await http
    .post('/auth', user)
    .then((response) => {
      auth.setToken(response.data.token)
      auth.setUser(response.data.user)
      router.push({ name: 'dashboard' })
    })
    .catch((error) => {
      console.log(error)
    })
}
</script>

<style lang="scss" scoped>
main {
  height: 100vh;
  background-color: #000;
  padding-top: 150px;
}

h1 {
  color: #f4ede8;
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 42px;
}

input,
button {
  width: 340px;
  height: 56px;
  border-radius: 10px;
  border: none;
}

input {
  background-color: #262529;
  color: #948f99;
  font-size: 16px;
  padding-left: 16px;

  &:focus {
    outline: none;
  }
}

button {
  margin: 16px 0px 42px;
  background-color: #ff859b;
  color: #312e38;
  font-size: 16px;
  font-weight: 500;
}

a {
  color: #ff859b;
  text-decoration: none;
}
</style>
