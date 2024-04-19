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

    const goTo = (path) => {
      router.push({ path: `/${path ? path : ''}` });
    };

    const section = [
      {
        content: 'Gestion Employés',
        onClick: () => goTo('users'),
        role: AdminRoles.MANAGER
      },
      {
        content: 'Gestion Entretien',
        onClick: () => goTo('interview/edit'),
        role: AdminRoles.MANAGER
      },
      {
        content: 'Mon manager : nom du manager',
        role: AdminRoles.USER
      },
      {
        content: 'Mon entretien personnel',
        onClick: () => goTo(`interview/1`),
        role: AdminRoles.USER
      }
    ];

    return {
      router,
      userStore,
      section
    };
  },
  methods: {
    goTo(path) {
      this.$router.push({ path: `/${path ? path : ''}` });
    }
  }
});
</script>

<template>
  <div class="containerBox">
    <div class="textContainer">
      <p class="text-h4">Bonjour {{ userStore.firstName }}, Bienvenu sur le dashboard RhTool</p>
    </div>
    <q-card
      v-for="(item, index) in section.filter((item) => userStore.hasRole(item.role))"
      :key="index"
      class="my-card"
      @click="item.onClick ? item.onClick() : null"
    >
      <q-card-section class="card-content"> {{ item.content }} </q-card-section>
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
