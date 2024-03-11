import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuth: ref(false),
    roles: ref([]),
  }),
  getters: {
    hasRole(roles) {
      return this.roles.includes(roles) ? true : false;
    },
    isAuthh() {
      return this.isAuth;
    }
  },
  actions: {
  },
})
