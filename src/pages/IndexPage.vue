<script>
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth-store';
import { AdminRoles } from 'src/api/user/adminRoles';
import axios from 'axios';

export default defineComponent({
  name: 'IndexPage',
  setup() {
    const router = useRouter();
    const userStore = useAuthStore();
    const isLoading = ref(true);
    const managerName = ref('');

    const fetchUsers = async () => {
      isLoading.value = true;
      try {
        const { data } = await axios.get(
          `https://rod-apps-restis-api-01.azurewebsites.net/api/aymen/users`
        );
        const currentUser = data.find((user) => user.id === userStore.id);
        const manager = data.find((user) => user.id === currentUser.manager);
        if (manager) {
          managerName.value = manager.firstName + ' ' + manager.lastName;
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        isLoading.value = false;
      }
    };

    const logout = () => {
      userStore.logout();
      window.location.reload();
    };
    onMounted(fetchUsers);

    return {
      isLoading,
      managerName,
      goTo: (path) => router.push({ path: `/${path || ''}` }),
      logout,
      userStore,
      AdminRoles
    };
  }
});
</script>

<template>
  <div v-if="isLoading" class="absolute-center">
    <button @click="logout">weofw</button>
    <q-circular-progress indeterminate rounded size="50px" color="primary" />
  </div>
  <div v-else class="containerBox">
    <div class="textContainer">
      <p class="text-h4">Bonjour {{ userStore.firstName }}, Bienvenu sur le dashboard RhTool</p>
    </div>
    <q-card
      v-if="userStore.roles.includes(AdminRoles.MANAGER) || userStore.roles.includes(AdminRoles.RH)"
      class="my-card"
      @click="goTo('users')"
    >
      <q-card-section class="card-content">Gestion Employés</q-card-section>
    </q-card>
    <q-card
      v-if="userStore.roles.includes(AdminRoles.MANAGER)"
      class="my-card"
      @click="goTo('interview/edit')"
    >
      <q-card-section class="card-content">Gestion Entretien</q-card-section>
    </q-card>
    <q-card
      v-if="userStore.roles.includes(AdminRoles.USER) && userStore.roles.length === 1"
      class="my-card"
    >
      <q-card-section class="card-content">Mon manager : {{ managerName }}</q-card-section>
    </q-card>
    <q-card
      v-if="userStore.roles.includes(AdminRoles.USER) && userStore.roles.length === 1"
      class="my-card"
      @click="goTo('interview/11')"
    >
      <q-card-section class="card-content">Mon entretien personnel</q-card-section>
    </q-card>
  </div>
</template>

<style>
.containerBox {
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
