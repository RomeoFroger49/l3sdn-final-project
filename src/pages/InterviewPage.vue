<template>
  <q-page class="q-pa-md">
    <q-stepper ref="stepper" v-model="step" header-nav color="primary" animated>
      <q-step
        :name="1"
        title="Objectifs de cette année"
        icon="settings"
        :done="step > 1"
        :header-nav="step > 1"
      >
        For each ad campaign that you create, you can control how much you're willing to spend on
        clicks and conversions, which networks and geographical locations you want your ads to show
        on, and more. {{ interview ? interview : 'rr' }}

        <q-stepper-navigation>
          <q-btn
            color="primary"
            label="Continue"
            @click="
              () => {
                done1 = true;
                step = 2;
              }
            "
          />
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="2"
        title="Résultat"
        icon="create_new_folder"
        :done="step > 2"
        :header-nav="step > 2"
      >
        An ad group contains one or more ads which target a shared set of keywords.

        <q-stepper-navigation>
          <q-btn
            color="primary"
            label="Continue"
            @click="
              () => {
                done2 = true;
                step = 3;
              }
            "
          />
          <q-btn flat color="primary" label="Back" class="q-ml-sm" @click="step = 1" />
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="3"
        title="Objectifs pour l'année prochaine"
        icon="add_comment"
        :done="step > 3"
        :header-nav="step > 3"
      >
        Try out different ad text to see what brings in the most customers, and learn how to enhance
        your ads using features like ad extensions. If you run into any problems with your ads, find
        out how to tell if they're running and how to resolve approval issues.

        <q-stepper-navigation>
          <q-btn
            color="primary"
            label="Continue"
            @click="
              () => {
                done3 = true;
                step = 4;
              }
            "
          />
          <q-btn flat color="primary" label="Back" class="q-ml-sm" @click="step = 2" />
        </q-stepper-navigation>
      </q-step>

      <q-step :name="4" title="Note de l'employé" icon="add_comment" :header-nav="step > 4">
        Try out different ad text to see what brings in the most customers, and learn how to enhance
        your ads using features like ad extensions. If you run into any problems with your ads, find
        out how to tell if they're running and how to resolve approval issues.

        <q-stepper-navigation>
          <q-btn color="primary" label="Finish" @click="done4 = true" />
          <q-btn flat color="primary" label="Back" class="q-ml-sm" @click="step = 3" />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
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

  
    const id = route.params.id;
    const interview = ref(fetchInterview(id));
    const step = ref(null);
    async function fetchInterview(id) {
      await entretiens
        .getInterviewById(id)
        .then((data) => {
          step.value = data.step
          return data;
        })
        .catch(() => {
          router.push({ path: '/unauthorized' });
        });
    }

    return {
      id,
      step,
      interview
    };
  }
});
</script>
