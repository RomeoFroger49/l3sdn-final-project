<template>
  <q-page class="q-pa-md">
    <div v-if="isLoading" class="absolute-center">
      <q-circular-progress indeterminate rounded size="50px" color="primary" class="q-ma-md" />
    </div>

    <q-stepper v-if="!isLoading" ref="stepper" v-model="step" header-nav color="primary" animated>
      <q-step
        v-for="(item, index) in sectionStep"
        :key="index"
        :name="item.step"
        :title="item.title"
        :icon="item.icon"
        :done="step > item.step"
        :header-nav="step > item.step"
      >
        <p v-if="interview ? interview.ManagerId == userStore.id : false">{{ item.content }}</p>

        <q-form v-else>
          <q-input
            v-model="bilan"
            :label="item.title"
            :rules="[val => !!val || 'Field is required']"
            type="textarea"
            :disable="done"
          />
        </q-form>

        <q-stepper-navigation>
          <q-btn
            v-if="step > 1"
            class="q-mr-md"
            color="primary"
            label="Back"
            @click="
              () => {
                done = true;
                interview.step = item.step - 1;
                console.log(interview.value);
              }
            "
          />
          <q-btn
            v-if="step < 4"
            color="primary"
            label="Continue"
            @click="
              () => {
                done = true;
                interview.step = item.step + 1;
                console.log(interview.value);
              }
            "
          />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth-store';
import { AdminRoles } from 'src/api/user/adminRoles';
import { entretiens } from 'src/api/data/entretien';

export default defineComponent({
  name: 'InterviewPage',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const userStore = useAuthStore();
    const isLoading = ref(false);


    const id = route.params.id;
    const interview = ref(null);
    const step = computed(() => {
      return interview.value?.step || 1;
    });

    const textEmpty = 'Pas de données disponibles';

    const bilan = computed(() => {
      return interview.value?.bilan || textEmpty;
    });

    const TenuDuPoste = computed(() => {
      return interview.value?.TenuDuPoste || textEmpty;
    });

    const Carrière = computed(() => {
      return interview.value?.Carrière || textEmpty;
    });

    const Conclusion = computed(() => {
      return interview.value?.Conclusion || textEmpty;
    });

    const sectionStep = [
      {
        title: 'Bilan',
        step: 1,
        icon: 'settings',
        content: bilan
      },
      {
        title: 'TenuDuPoste',
        step: 2,
        icon: 'settings',
        content: TenuDuPoste
      },
      {
        title: 'Carrière',
        step: 3,
        icon: 'settings',
        content: Carrière
      },
      {
        title: 'Conclusion',
        step: 4,
        icon: 'settings',
        content: Conclusion
      }
    ];

    async function fetchInterview(id) {
      isLoading.value = true;
      try {
        const data = await entretiens.getInterviewById(id);
        interview.value = data;
        isLoading.value = false;
      } catch (error) {
        router.push({ name: 'ErrorNotFound' });
      }
    }

    onMounted(() => {
      fetchInterview(id);
    });

    return {
      id,
      interview,
      bilan,
      isLoading,
      step,
      sectionStep,
      userStore,
      AdminRoles
    };
  }
});
</script>
