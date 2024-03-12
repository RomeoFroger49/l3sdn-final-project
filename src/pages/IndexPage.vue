<template>
  <button @click="goToLogin()">login</button>
  <button @click="goToUsers()">users</button>
</template>

<script>
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'IndexPage',
  setup() {
    const router = useRouter()

    const goToLogin = () => {
      router.push({ path: '/login' })
    }

    const goToUsers = () => {
      router.push({ path: '/users' })
    }

    return {
      router,
      goToLogin,
      goToUsers
    }
  }
})

</script>
