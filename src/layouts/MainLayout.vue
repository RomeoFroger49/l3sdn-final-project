<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title @click="goTo()">
          <q-icon
            name="fa-solid fa-screwdriver-wrench"
            style="padding-inline: 0.5em; cursor: pointer"
          />
          <span style="cursor: pointer">RhTools</span>
        </q-toolbar-title>
        <DarkModeButton />

        <q-btn flat dense round aria-label="menu" icon="menu">
          <q-menu>
            <q-list>
              <q-item
                v-for="item in listSettings.filter((item) => AuthStore.hasRole(item.roles))"
                :key="item.label"
                clickable
                @click="item.onClick"
              >
                <q-item-section>{{ item.label }}</q-item-section>
                <q-item-section avatar>
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
import { AdminRoles } from 'src/api/user/adminRoles';
import DarkModeButton from '../components/DarkModeButton.vue';

export default defineComponent({
  name: 'MainLayout',
  setup() {
    const leftDrawerOpen = ref(true);
    const router = useRouter();
    const AuthStore = useAuthStore();

    const listSettings = [
      {
        label: 'My Interview',
        icon: 'book',
        roles: AdminRoles.USER,
        onClick: () => {
          goTo('interview');
        }
      },
      {
        label: 'Users',
        icon: 'group',
        roles: AdminRoles.MANAGER,
        onClick: () => {
          goTo('users');
        }
      },
      {
        label: 'Logout',
        icon: 'logout',
        roles: AdminRoles.USER,
        onClick: () => {
          logout();
        }
      }
    ];

    const logout = () => {
      AuthStore.logout();
      window.location.reload();
    };

    const goTo = (path) => {
      router.push({ path: `/${path ? path : ''}` });
    };

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      goTo,
      logout,
      AuthStore,
      listSettings,
      AdminRoles
    };
  },
  components: {
    DarkModeButton
  }
});
</script>
