<template>
  <div v-if="isLoading" class="absolute-center">
    <q-circular-progress indeterminate rounded size="50px" color="primary" />
  </div>
  <div v-else class="q-pa-md">
    <q-input v-model="searchTerm" filled label="Search" class="q-mb-md" />
    <q-table
      :rows="filteredRows"
      :columns="tableColumns"
      row-key="id"
      :rows-per-page-options="[15]"
      :rows-per-page="15"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn color="primary" label="Edit" @click="editUser(props.row.id)" />
          <q-btn color="negative" label="Delete" @click="deleteUser(props.row.id)" />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth-store';
import axios from 'axios';

export default {
  name: 'UsersPage',
  setup() {
    const isLoading = ref(false);
    const rows = ref([]);
    const searchTerm = ref('');
    const authStore = useAuthStore();
    const userStore = useAuthStore();
    const router = useRouter();

    const isRh = userStore.roles.includes('RH');

    const tableColumns = [
      { name: 'id', label: 'ID', field: 'id', sortable: true },
      { name: 'email', label: 'Email', field: 'email' },
      { name: 'firstName', label: 'First Name', field: 'firstName' },
      { name: 'lastName', label: 'Last Name', field: 'lastName' },
      { name: 'roles', label: 'Roles', field: 'roles' },
      { name: 'actions', label: 'Actions', field: 'actions', sortable: false }
    ];

    const fetchUsers = async () => {
      isLoading.value = true;
      try {
        const response = await axios.get(
          `https://rod-apps-restis-api-01.azurewebsites.net/api/aymen/users`
        );
        const data = response.data;
        const databyManager = data.filter((user) => user.manager === authStore.id);
        rows.value = isRh ? data : databyManager;
      } catch (error) {
        // console.error('Failed to fetch users:', error);
      } finally {
        isLoading.value = false;
      }
    };

    // a cause de l'api je peu pas supprimer un user, donc j'ai bricole un truc degeu pour le faire
    const deleteUser = async (id) => {
      isLoading.value = true;
      try {
        const { data } = await axios.get(
          `https://rod-apps-restis-api-01.azurewebsites.net/api/aymen/users`
        );
        await axios.put(
          `https://rod-apps-restis-api-01.azurewebsites.net/api/aymen/users`,
          data.filter((user) => user.id !== id)
        );
        rows.value = remainingUsers;
      } catch (error) {
        // console.error('Failed to delete user:', error);
      } finally {
        isLoading.value = false;
      }
    };

    const filteredRows = computed(() => {
      const lowerCaseSearch = searchTerm.value.toLowerCase();
      return rows.value.filter(
        (row) =>
          row.firstName.toLowerCase().includes(lowerCaseSearch) ||
          row.lastName.toLowerCase().includes(lowerCaseSearch)
      );
    });

    onMounted(() => {
      fetchUsers();
    });

    const editUser = (id) => {
      router.push(`/user/${id}`);
    };

    return { isLoading, searchTerm, filteredRows, tableColumns, editUser, deleteUser };
  }
};
</script>

<style scoped>
.absolute-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
