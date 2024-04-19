<template>
  <q-page class="q-pa-md">
    <div v-if="isLoading" class="absolute-center">
      <q-circular-progress indeterminate rounded size="50px" color="primary" class="q-ma-md" />
    </div>

    <div v-else class="q-pa-md">
      <h1 class="text-h6">Entretien - {{ interview?.title }}</h1>
      <h1 v-if="userStore.id === interview?.employeId && interview" class="text-h6">
        Interviewer: {{ managerName }}
      </h1>
      <h1 v-else class="text-h6">Employé: {{ employeName }}</h1>
      <q-stepper v-model="step" vertical color="primary" animated>
        <q-step :name="1" title="Bilan" icon="settings" :done="interview?.Bilan !== ''">
          <q-form
            v-if="userStore.id === interview?.employeId && interview"
            class="q-mt-md"
            @submit="submit"
          >
            <q-input v-model="interview.Bilan" filled label="Bilan" type="textarea"> </q-input>
          </q-form>

          <p v-else>{{ interview?.Bilan }}</p>

          <q-stepper-navigation>
            <q-btn color="primary" label="Continue" @click="step = 2" />
          </q-stepper-navigation>
        </q-step>

        <q-step
          :name="2"
          title="Tenue Du Poste"
          caption="Optional"
          icon="create_new_folder"
          :done="interview?.TenuDuPoste !== ''"
        >
          <q-form
            v-if="userStore.id === interview?.employeId && interview"
            class="q-mt-md"
            @submit="submit"
          >
            <q-input v-model="interview.TenuDuPoste" filled label="Tenue Du Poste" type="textarea">
            </q-input>
          </q-form>

          <p v-else>{{ interview?.TenuDuPoste }}</p>

          <q-stepper-navigation>
            <q-btn color="primary" label="Continue" @click="step = 3" />
            <q-btn flat color="primary" label="Back" class="q-ml-sm" @click="step = 1" />
          </q-stepper-navigation>
        </q-step>

        <q-step :name="3" title="Carrière" icon="assignment" :done="interview?.Carrière !== ''">
          <q-form
            v-if="userStore.id === interview?.employeId && interview"
            class="q-mt-md"
            @submit="submit"
          >
            <q-input v-model="interview.Carrière" filled label="Carrière" type="textarea">
            </q-input>
          </q-form>

          <p v-else>{{ interview?.Carrière }}</p>

          <q-stepper-navigation>
            <q-btn color="primary" label="Continue" @click="step = 4" />
            <q-btn flat color="primary" label="Back" class="q-ml-sm" @click="step = 2" />
          </q-stepper-navigation>
        </q-step>

        <q-step
          :name="4"
          title="Conclusion"
          icon="add_comment"
          :done="interview?.Conclusion !== ''"
        >
          <q-form
            v-if="userStore.id === interview?.employeId && interview"
            class="q-mt-md"
            @submit="submit"
          >
            <q-input v-model="interview.Conclusion" filled label="Conclusion" type="textarea">
            </q-input>
          </q-form>

          <p v-else>{{ interview?.Conclusion }}</p>

          <q-stepper-navigation>
            <q-btn flat color="primary" label="Back" class="q-ml-sm" @click="step = 3" />
          </q-stepper-navigation>
        </q-step>
        <q-btn
          v-if="userStore.id === interview?.employeId && interview"
          class="q-ml-sm"
          @click="putInterview"
        >
          Enregistrer
        </q-btn>
      </q-stepper>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth-store';
import { AdminRoles } from 'src/api/user/adminRoles';
import { entretiens } from 'src/api/data/entretien';
import axios from 'axios';

export default defineComponent({
  name: 'InterviewPage',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const userStore = useAuthStore();

    const isLoading = ref(false);
    const step = ref(1);
    const allInterviews = ref([]);

    const id = route.params.id;
    const interview = ref(null);
    const manager = ref(null);
    const employe = ref(null);

    const textEmpty = 'Pas de données disponibles';

    const managerName = computed(() => {
      return manager.value?.firstName + ' ' + manager.value?.lastName || textEmpty;
    });

    const employeName = computed(() => {
      return employe.value?.firstName + ' ' + employe.value?.lastName || textEmpty;
    });

    async function fetchInterview(id) {
      isLoading.value = true;
      try {
        const { data } = await axios.get(
          `https://rod-apps-restis-api-01.azurewebsites.net/api/aymen/entretiens`
        );

        // authorize only the employe, the manager and the RH to access the page
        if (data.employeId !== userStore.id && data.managerId !== userStore.id && !userStore.hasRole(AdminRoles.RH)) {
          router.push({ path: '/unauthorized' });
        }

        allInterviews.value = data;
        let itw = null;
        if (data == Array) {
          itw = data.find((itw) => itw.id == id);
        } else if (data.id == id){
          itw = data;
        }
        interview.value = itw;
        isLoading.value = false;
        fetchNameEmployeOrManager(itw.managerId);
        fetchNameEmployeOrManager(itw.employeId);
      } catch (error) {
        router.push({ name: 'ErrorNotFound' });
      } finally {
        isLoading.value = false;
      }
    }

    const putInterview = async () => {
      isLoading.value = true;
      try {
        await axios.put(
          `https://rod-apps-restis-api-01.azurewebsites.net/api/aymen/entretiens`,
          interview.value
        );
        isLoading.value = false;
      } catch (error) {
        isLoading.value = false;
      }
    };

    async function fetchNameEmployeOrManager(id) {
      isLoading.value = true;
      try {
        const { data } = await axios.get(
          `https://rod-apps-restis-api-01.azurewebsites.net/api/aymen/users`
        );
        const user = data.find((user) => user.id == id);
        if (!user) {
          return '';
        }
        if (user.roles.includes(AdminRoles.MANAGER)) {
          manager.value = user;
        } else {
          employe.value = user;
        }
      } finally {
        isLoading.value = false;
      }
    }

    const submit = (e) => {

      const index = allInterviews.value.findIndex((u) => u.id === interview.value.id);
      if (index !== -1) {
        allInterviews.value[index] = interview.value;
      }

      putInterview().then(() => {
        window.location.reload();
      });
    };

    onMounted(() => {
      fetchInterview(id);
    });

    return {
      id,
      interview,
      isLoading,
      step,
      userStore,
      managerName,
      employeName,
      submit,
      putInterview,
      AdminRoles
    };
  }
});
</script>
