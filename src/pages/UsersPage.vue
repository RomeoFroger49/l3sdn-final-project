<template>
  <div v-if="isLoading" class="absolute-center">
    <q-circular-progress indeterminate rounded size="50px" color="primary" class="q-ma-md" />
  </div>
  <div v-if="!isLoading" class="q-pa-md">
    <q-table title="Users" :rows="rows" :columns="columns" row-key="name" />
  </div>
</template>

<script>
import { useAuthStore } from 'src/stores/auth-store';
import { ref } from 'vue';
import axios from 'axios';

export default {
  name: 'UsersPage',
  setup() {
    const rows = ref([]);
    const isLoading = ref(false);
    const store = useAuthStore();

    const columns = [
      {
        name: 'id',
        required: true,
        label: 'ID',
        align: 'left',
        field: 'id',
        sortable: true
      },
      { name: 'email', label: 'Email', field: 'email', sortable: true },
      { name: 'firstName', label: 'firstName', field: 'firstName' },
      { name: 'lastName', label: 'lastName', field: 'lastName' },
      { name: 'roles', label: 'roles', field: 'roles' }
    ];

    const getUsersByManager = async (id) => {
      isLoading.value = true;
      try {
        const response = await axios.get(
          `https://rod-apps-restis-api-01.azurewebsites.net/api/aymen/users`
        );
        const data = response.data;
        isLoading.value = false;
        return data.filter((user) => user.manager === 2);
      } catch (error) {
        isLoading.value = false;
        return [];
      }
    };

    getUsersByManager(store.id).then((data) => {
      rows.value = data;
    });

    return {
      rows,
      columns,
      isLoading
    };
  }
};
</script>
