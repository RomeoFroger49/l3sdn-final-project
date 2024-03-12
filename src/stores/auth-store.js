import { defineStore } from "pinia";
import { ref } from "vue";
import { users } from "src/api/users";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    email: ref(""),
    password: ref(""),
    isAuth: ref(false),
    roles: ref([]),
  }),
  getters: {
    hasRole(roles) {
      return this.roles.includes(roles) ? true : false;
    },
    isAuthenticated() {
      return this.isAuth;
    },
    getUser() {
      if (this.isAuth) {
        return {
          email: this.email,
          roles: this.roles,
          isAuth: this.isAuth,
        };
      }
    },
  },
  actions: {
    async login(email, password) {
      await users.getUsers().then((data) => {
        const user = data.find(
          (user) => user.email === email && user.password === password
        );

        if (user) {
          this.email = user.email;
          this.password = user.password;
          this.isAuth = true;
          this.roles = user.roles;
        }
      });
    },
    logout() {
      this.email = "";
      this.password = "";
      this.isAuth = false;
      this.roles = [];
    },
  },
});
