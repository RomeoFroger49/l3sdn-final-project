<template>
  <div v-if="isLoading" class="absolute-center">
    <q-circular-progress indeterminate rounded size="50px" color="primary" />
  </div>
  <div v-else class="q-pa-md">
    <q-input v-model="searchTerm" filled label="Search (title/employe/responsable)" class="q-mb-md" />
    <q-table
      :rows="filteredRows"
      :columns="tableColumns"
      row-key="id"
      :rows-per-page-options="[15]"
      :rows-per-page="15"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn color="negative" label="Delete" @click="deleteItw(props.row.id)" />
        </q-td>
      </template>
    </q-table>
    <q-btn
      color="primary"
      label="creer un interview"
      @click="router.push({ path: 'interview/add' })"
    />
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth-store';
import { AdminRoles } from 'src/api/user/adminRoles';
import { entretiens } from 'src/api/data/entretien';
import axios, { all } from 'axios';

export default defineComponent({
  name: 'InterviewAllPage',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const userStore = useAuthStore();

    const allInterviews = ref([]);
    const isLoading = ref(false);
    const rows = ref([]);
    const searchTerm = ref('');
    const isRh = userStore.roles.includes('RH');

    const tableColumns = [
      { name: 'id', label: 'ID', field: 'id', sortable: true },
      { name: 'title', label: 'Title', field: 'title' },
      { name: 'employe', label: 'Employé', field: 'employe' },
      { name: 'responsable', label: 'Responsable', field: 'responsable', sortable: true },
      { name: 'actions', label: 'Actions', field: 'actions', sortable: false }
    ];

    const fetchEntretiensByManager = async () => {
      isLoading.value = true;
      try {
        const { data } = await axios.get(
          `https://rod-apps-restis-api-01.azurewebsites.net/api/aymen/entretiens`
        );
        allInterviews.value = data;
        let itw = null;
        if (Array.isArray(data)) {
          itw = data.filter((itw) => itw.managerId == userStore.id);
        } else {
          //api returns an object not an array if there is only one object
          itw = [data];
        }
        rows.value = isRh ? data : itw;

        rows.value.forEach(async (row) => {
          row.employe = await fetchNameById(row.employeId);
          row.responsable = await fetchNameById(row.managerId);
        });
      } catch (error) {
      } finally {
        isLoading.value = false;
      }
    };

    const fetchNameById = async (id) => {
      try {
        const { data } = await axios.get(
          `https://rod-apps-restis-api-01.azurewebsites.net/api/aymen/users`
        );
        const user = data.find((user) => user.id === id);
        return user.firstName + ' ' + user.lastName;
      } catch (error) {
        return 'Pas de données disponibles';
      }
    };

    const deleteItw = async (id) => {
      isLoading.value = true;
      try {
        const { data } = await axios.get(
          `https://rod-apps-restis-api-01.azurewebsites.net/api/aymen/entretiens`
        );
        await axios.put(
          `https://rod-apps-restis-api-01.azurewebsites.net/api/aymen/entretiens`,
          data.filter((user) => user.id !== id)
        );
        window.location.reload();
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
          row.employee?.toLowerCase().includes(lowerCaseSearch) ||
          row.responsable?.toLowerCase().includes(lowerCaseSearch) ||
          row.title?.toLowerCase().includes(lowerCaseSearch)
      );
    });

    onMounted(() => {
      fetchEntretiensByManager(userStore.id);
    });
    return {
      userStore,
      router,
      isLoading,
      tableColumns,
      filteredRows,
      deleteItw,
      searchTerm,
      AdminRoles
    };
  }
});
</script>
