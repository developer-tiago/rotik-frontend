<template>
  <main>
    <div class="container d-flex flex-column align-items-center">
      <h1>Crie sua conta</h1>
      <input type="text" placeholder="Nome" v-model="user.name" @input="validator.name = null" />
      <div v-if="validator.name === false" class="invalid-field ps-2">
        <span>Informe um nome válido</span>
      </div>
      <input
        class="mt-2"
        type="email"
        placeholder="E-mail"
        v-model="user.email"
        @input="validator.email = null"
      />
      <div v-if="validator.email === false" class="invalid-field ps-2">
        <span>{{ validator.messageErrorEmail }}</span>
      </div>
      <input
        class="mt-2"
        type="password"
        placeholder="Senha"
        v-model="user.password"
        @input="validator.password = null"
      />
      <div v-if="validator.password === false" class="invalid-field ps-2">
        <span>A senha deve ter pelo menos 6 caracteres</span>
      </div>
      <button @click="register()">Cadastrar</button>
      <RouterLink to="/login">
        <i class="ri-arrow-left-line"></i>
        Voltar para o login</RouterLink
      >
    </div>
  </main>
</template>

<script setup>
import http from '@/services/index'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const user = reactive({
  name: '',
  email: '',
  password: ''
})

let validator = reactive({
  name: null,
  email: null,
  password: null,
  messageErrorEmail: ''
})

async function register() {
  if (checkFields()) {
    return
  }

  await http
    .post('/register', user)
    .then(() => {
      router.push({ name: 'login' })
    })
    .catch((error) => {
      console.log('aqui')
      if (error.response.data.error == 'Email already exist') {
        console.log('aqui')
        validator.messageErrorEmail = 'E-mail já esta sendo utilizado'
        validator.email = false
      }
    })
}

function checkFields() {
  let invalidField = false

  if (user.name.length < 3) {
    console.log('Nome inválido')
    validator.name = false
    console.log(validator.name)
    invalidField = true
  }

  if (!validateEmail(user.email)) {
    console.log('E-mail inválido')
    validator.messageErrorEmail = 'Informe um e-mail válido'
    validator.email = false
    invalidField = true
  }

  if (user.password.length < 6) {
    console.log('Senha menor que 6 caracteres')
    validator.password = false
    invalidField = true
  }

  return invalidField
}

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
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

.invalid-field {
  color: red;
  font-size: 12px;
  width: 340px;
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
