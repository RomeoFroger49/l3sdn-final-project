<template>
  <button @click="goToLogin()">login</button>
  <button v-if="roleRH" @click="goToUsers()">users</button>
</template>

<script>
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth-store';
import { AdminRoles } from 'src/api/user/adminRoles';

export default defineComponent({
  name: 'IndexPage',
  setup() {
    const router = useRouter();
    const userStore = useAuthStore();

    const roleRH = userStore.hasRole(AdminRoles.RH);
    const roleMANAGER = userStore.hasRole(AdminRoles.MANAGER);

    const goToLogin = () => {
      router.push({ path: '/login' });
    };

    const goToUsers = () => {
      router.push({ path: '/users' });
    };

    return {
      router,
      goToLogin,
      goToUsers,
      roleRH
    };
  }
});
</script>
