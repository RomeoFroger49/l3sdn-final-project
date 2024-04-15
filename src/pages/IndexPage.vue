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
    const roleUSER = userStore.hasRole(AdminRoles.USER);

    const role = roleRH ? 'RH' : roleMANAGER ? 'MANAGER' : roleUSER ? 'Employé ' : 'UNKNOWN';

    const name = userStore.firstName + ' ' + userStore.lastName;

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
      roleRH,
      roleMANAGER,
      roleUSER,
      role,
      name
    };
  },
  methods: {
    goToEmployeeManagement() {
      this.$router.push('/employee-management');
    },
    goToInterviewManagement() {
      this.$router.push('/interview-management');
    },
    goToInterview() {
      this.$router.push({ path: '/interview' });
    }
  }
});
</script>

<template>
  <div class="container">
    <div class="textContainer">
      <p>Bonjour {{ name }}, Bienvenu sur le dashboard RhTool</p>
      <p>en tant que {{ role }}, vous avez accès à</p>
    </div>
    <q-card v-if="roleRH || roleMANAGER" class="my-card" @click="goToEmployeeManagement">
      <q-card-section class="card-content"> Gestion Employés </q-card-section>
    </q-card>
    <q-card v-if="roleRH || roleMANAGER" class="my-card" @click="goToInterviewManagement">
      <q-card-section class="card-content">Gestion Entretien </q-card-section>
    </q-card>
    <q-card v-if="roleUSER" class="my-card">
      <q-card-section class="card-content"> Mon manager : nom du manager</q-card-section>
    </q-card>
    <q-card v-if="roleUSER" class="my-card" @click="goToInterview">
      <q-card-section class="card-content"> Mon prochain entretien personnel</q-card-section>
    </q-card>
  </div>
</template>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.textContainer {
  color: #333; /* Couleur du texte */
  font-size: 16px; /* Taille du texte */
  line-height: 1.5; /* Espacement des lignes */
  padding: 10px; /* Espace intérieur autour du texte */
  margin-bottom: 20px; /* Espace sous le conteneur de texte */
  text-align: center; /* Centrer le texte */
}
.my-card {
  width: 90%;
  max-width: 500px;
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.1s ease-in-out;
}
.my-card:hover {
  transform: scale(1.05);
}
.card-content {
  text-align: center;
  font-size: 18px;
}
</style>
