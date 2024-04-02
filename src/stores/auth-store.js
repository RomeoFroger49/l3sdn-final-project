import { defineStore } from 'pinia';
import { ref } from 'vue';
import { users } from 'src/api/user/users';
import { LocalStorage } from 'quasar';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    email: ref(''),
    isAuth: ref(false),
    roles: ref([])
  }),
  getters: {
    hasRole: (state) => {
      return (role) => state.roles.includes(role);
    },
    isAuthenticated() {
      return this.isAuth;
    },
    getUser() {
      if (this.isAuth) {
        return {
          email: this.email,
          roles: this.roles,
          isAuth: this.isAuth
        };
      }
    }
  },
  actions: {
    // Default
    setUser(email, roles) {
      this.email = email;
      this.roles = roles;
      this.isAuth = true;
    },
    cleanUser() {
      this.email = '';
      this.roles = [];
      this.isAuth = false;
    },

    //API && Cookies
    async login(email, password) {
      await users.login(email, password).then((data) => {

        if (data) {
          this.setUser(data.email, data.roles);
          LocalStorage.set('userInfo', JSON.stringify(data));
        }
      });
    },
    loadUserFromLocalStorage() {
      if (LocalStorage.has('userInfo')) {
        const user = JSON.parse(LocalStorage.getItem('userInfo'));
        this.setUser(user.email, user.roles);
      }
    },
    logout() {
      this.cleanUser();
      LocalStorage.remove('userInfo');
    }
  }
});
