<template>
  <div class="q-pa-md absolute-center" style="max-width: 400px">
    <q-form class="q-gutter-md" @submit="onSubmit" @reset="onReset">
      <q-input
        v-model="newUser.firstName"
        filled
        label="First Name *"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />

      <q-input
        v-model="newUser.lastName"
        filled
        label="Last Name *"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />

      <q-input
        v-model="newUser.email"
        filled
        label="Email *"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />

      <q-input
        v-model="newUser.password"
        type="password"
        filled
        label="Password *"
        lazy-rules
        :rules="[(val) => (val && val.length > 4) || 'Password must be longer than 4 characters']"
      />

      <div>
        <q-btn label="Create User" type="submit" color="primary" />
      </div>
    </q-form>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth-store';

export default {
  name: 'UserCreatePage',
  setup() {
    const authStore = useAuthStore();

    const newUser = ref({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      id: 0,
      roles: ['USER'],
      manager: authStore.id,
      hasEntretien: null
    });
    const isLoading = ref(false);
    const router = useRouter();

    const addUser = async () => {
      isLoading.value = true;
      try {
        const { data } = await axios.get(
          `https://rod-apps-restis-api-01.azurewebsites.net/api/aymen/users`
        );
        const id = data.length;
        newUser.value.id = id;

        const allUsers = [...data];
        allUsers.push(newUser.value);

        await axios.put(
          `https://rod-apps-restis-api-01.azurewebsites.net/api/aymen/users`,
          allUsers
        );
        isLoading.value = false;
        router.push({ path: '/users' });
      } catch (error) {
        isLoading.value = false;
        console.error('Failed to create user:', error);
      }
    };

    const onSubmit = () => {
      addUser();
    };

    const onReset = () => {
      newUser.value = { firstName: '', lastName: '', email: '', password: '' };
    };

    return {
      isLoading,
      newUser,
      onSubmit,
      onReset
    };
  }
};
</script>
