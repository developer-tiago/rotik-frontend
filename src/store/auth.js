import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import IndexService from '@/services/index'

export const useAuth = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token'))
  const user = ref(JSON.parse(localStorage.getItem('user')))
  const router = useRouter()

  function setToken(tokenValue) {
    localStorage.setItem('token', tokenValue)
    token.value = tokenValue
  }

  function setUser(userValue) {
    localStorage.setItem('user', JSON.stringify(userValue))
    user.value = userValue
  }

  const isAuthenticated = computed(() => {
    return token.value && user.value
  })

  const userLogged = computed(() => {
    return {
      name: user.value.name,
      id: user.value.id
    }
  })

  async function checkToken() {
    try {
      const tokenAuth = 'Bearer ' + token.value
      const { data } = await IndexService.get('/auth/verify', {
        headers: {
          Authorization: tokenAuth
        }
      })

      return data
    } catch (error) {
      console.log(error.response.data)
    }
  }

  function clear() {
    router.push('/login')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    token.value = ''
    user.value = ''
  }

  return {
    token,
    user,
    setToken,
    setUser,
    checkToken,
    isAuthenticated,
    userLogged,
    clear
  }
})
