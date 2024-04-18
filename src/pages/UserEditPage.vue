<template>
  <div class="q-pa-md absolute-center" style="max-width: 400px">
    <q-form class="q-gutter-md" @submit="onSubmit" @reset="onReset">
      <q-input
        v-model="firstName"
        filled
        label="First Name *"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />

      <q-input
        v-model="lastName"
        filled
        label="Last Name *"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />

      <div>
        <q-btn label="Modifier" type="submit" color="primary" />
      </div>
    </q-form>
  </div>
</template>

<script>
import { useAuthStore } from 'src/stores/auth-store';
import { ref } from 'vue';
import axios from 'axios';
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'UserEditPage',
  setup() {
    const allUsers = ref([]);
    const user = ref({});
    const firstName = ref('');
    const lastName = ref('');
    const isLoading = ref(false);
    const store = useAuthStore();
    const route = useRoute();
    const router = useRouter();

    const userId = route.params.id;

    const getUsersByManager = async (id) => {
      isLoading.value = true;
      try {
        const response = await axios.get(
          `https://rod-apps-restis-api-01.azurewebsites.net/api/aymen/users`
        );
        const data = response.data;
        isLoading.value = false;
        return data;
      } catch (error) {
        isLoading.value = false;
        return [];
      }
    };

    const putUser = async () => {
      isLoading.value = true;
      try {
        await axios.put(
          `https://rod-apps-restis-api-01.azurewebsites.net/api/aymen/users`,
          allUsers.value
        );
        isLoading.value = false;
      } catch (error) {
        isLoading.value = false;
      }
    };

    const onSubmit = () => {
      user.value.firstName = firstName.value;
      user.value.lastName = lastName.value;

      const index = allUsers.value.findIndex((u) => u.id === user.value.id);
      if (index !== -1) {
        allUsers.value[index] = user.value;
      }

      putUser().then(() => {
        router.push({ path: '/users' });
      });
    };

    onMounted(() => {
      getUsersByManager(store.id).then((data) => {
        allUsers.value = data;
        user.value = data.find((user) => user.id == userId);

        firstName.value = user.value.firstName;
        lastName.value = user.value.lastName;
      });
    });

    return {
      isLoading,
      firstName,
      lastName,
      onSubmit
    };
  }
};
</script>
