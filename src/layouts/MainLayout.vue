<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title @click="goToHome()">
          <q-icon name="fa-solid fa-screwdriver-wrench" style="padding-inline: 0.5em;" />
          <span>RhTools</span>
        </q-toolbar-title>

        <q-btn flat dense round aria-label="menu" icon="menu">
          <q-menu>
            <q-list>
              <q-item
                v-for="item in listSettings"
                :key="item.label"
                clickable
                @click="item.onClick"
              >
                <q-item-section>{{ item.label }}</q-item-section>
                <q-item-section avatar >
                  <q-icon :name="item.icon" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth-store';

export default defineComponent({
  name: 'MainLayout',

  setup() {
    const leftDrawerOpen = ref(true);
    const router = useRouter();
    const AuthStore = useAuthStore();

    const listSettings = [
      {
        label: 'Profile',
        icon: 'person'
      },
      {
        label: 'Logout',
        icon: 'logout',
        onClick: () => {
          logout();
        }
      }
    ];

    const logout = () => {
      AuthStore.logout();
      window.location.reload();
    };

    const goToHome = () => {
      router.push({ path: '/' });
    };

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      goToHome,
      logout,
      AuthStore,
      listSettings
    };
  }
});
</script>
