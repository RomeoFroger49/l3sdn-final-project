<template>
  <div class="q-pa-md absolute-center" style="max-width: 400px">
    <q-form class="q-gutter-md" @submit="onSubmit" @reset="onReset">
      <q-input
        v-model="newEntretien.title"
        filled
        label="Title *"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />

      <q-select
        v-model="newEntretien.managerId"
        filled
        label="Manager *"
        :options="managerUsers.map((user) => ({ label: user.firstName, value: user.id }))"
        :rules="[(val) => val || 'Please select a manager']"
      />

      <q-select
        v-model="newEntretien.employeId"
        filled
        label="Employé *"
        :options="users.map((user) => ({ label: user.firstName, value: user.id }))"
        :rules="[(val) => val || 'Please select an employee']"
      />

      <div>
        <q-btn label="Create Interview" type="submit" color="primary" />
      </div>
    </q-form>
  </div>

  <q-dialog v-model="alertUser">
    <q-card>
      <q-card-section>
        <div class="text-h6">Alert</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        Employee has already an interview
      </q-card-section>

      <q-card-actions align="right">
        <q-btn v-close-popup flat label="OK" color="primary" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="alert">
    <q-card>
      <q-card-section>
        <div class="text-h6">Alert</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        Manager and employee cannot be the same person
      </q-card-section>

      <q-card-actions align="right">
        <q-btn v-close-popup flat label="OK" color="primary" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth-store';
import { AdminRoles } from 'src/api/user/adminRoles';

export default {
  name: 'CreateInterviewPage',
  setup() {

    const alertUser = ref(false);
    const alert = ref(false);
    const allUsers = ref([]);

    const users = computed(() => {
      return allUsers.value;
    });

    const managerUsers = computed(() => {
      return allUsers.value.filter((user) => user.roles.includes(AdminRoles.MANAGER));
    });

    const newEntretien = ref({
      title: '',
      step: 0,
      managerId: null,
      employeId: null,
      id: 0,
      Bilan: '',
      TenuDuPoste: '',
      Carrière: '',
      Conclusion: ''
    });
    const isLoading = ref(false);
    const router = useRouter();

    const addInterview = async () => {
      isLoading.value = true;
      try {
        const { data } = await axios.get(
          `https://rod-apps-restis-api-01.azurewebsites.net/api/aymen/entretiens`
        );
        let allInterviews = null;
        if (Array.isArray(data)) {
          allInterviews = data;
        } else {
          allInterviews = [data];
        }

        const id = data.length;
        newEntretien.value.id = id;
        newEntretien.value.managerId = newEntretien.value.managerId.value;
        newEntretien.value.employeId = newEntretien.value.employeId.value;

        if (newEntretien.value.managerId === newEntretien.value.employeId) {
          alert.value = true;
          throw new Error('Manager and employee cannot be the same person');
        }

        const employeDouble = allInterviews.filter((itw) => itw.employeId == newEntretien.value.employeId);
        if (employeDouble.length > 0) {
          alertUser.value = true;
          throw new Error('Employee has already an interview');
        }

        allInterviews.push(newEntretien.value);

        await axios.put(
          `https://rod-apps-restis-api-01.azurewebsites.net/api/aymen/entretiens`,
          allInterviews
        );
        isLoading.value = false;
        router.push({ path: '/interview' });
      } catch (error) {
        isLoading.value = false;
      }
    };

    const fetchUsers = async () => {
      isLoading.value = true;
      try {
        const { data } = await axios.get(
          `https://rod-apps-restis-api-01.azurewebsites.net/api/aymen/users`
        );
        allUsers.value = data;
      } finally {
        isLoading.value = false;
      }
    };

    const onSubmit = () => {
      addInterview();
    };

    const onReset = () => {
      newEntretien.value = { title: '', employeId: null, managerId: null };
    };

    onMounted(() => {
      fetchUsers();
    });

    return {
      isLoading,
      newEntretien,
      users,
      managerUsers,
      alert,
      alertUser,
      onSubmit,
      onReset
    };
  }
};
</script>
