import { defineStore } from 'pinia';
import { ref } from 'vue';
import { users } from 'src/api/user/users';
import { LocalStorage } from 'quasar';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    email: ref(''),
    isAuth: ref(false),
    roles: ref([]),
    firstName: ref(''),
    lastName: ref(''),
    managerId: ref(null)
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
          firstName: this.firstName,
          lastName: this.lastName,
          isAuth: this.isAuth
        };
      }
    }
  },
  actions: {
    // Default
    setUser(email, roles, firstName, lastName, managerId) {
      this.email = email;
      this.roles = roles;
      this.firstName = firstName;
      this.lastName = lastName;
      this.isAuth = true;
      this.managerId = managerId;
    },
    cleanUser() {
      this.email = '';
      this.firstName = '';
      this.lastName = '';
      this.managerId = null;
      this.roles = [];
      this.isAuth = false;
    },

    //API && Cookies
    async login(email, password) {
      await users.login(email, password).then((data) => {
        if (data) {
          this.setUser(data.email, data.roles, data.firstName, data.lastName ,data.manager);
          LocalStorage.set('userInfo', JSON.stringify(data));
        }
      });
    },
    loadUserFromLocalStorage() {
      if (LocalStorage.has('userInfo')) {
        const user = JSON.parse(LocalStorage.getItem('userInfo'));
        this.setUser(user.email, user.roles, user.firstName, user.lastName, user.manager);
      }
    },

    logout() {
      this.cleanUser();
      LocalStorage.remove('userInfo');
    }
  }
});
