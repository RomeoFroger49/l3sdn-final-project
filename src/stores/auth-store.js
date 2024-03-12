import { defineStore } from "pinia";
import { ref } from "vue";
import { users } from "src/api/user/users";
import Cookies from "js-cookie";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    email: ref(""),
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
    // Default
    setUser(email, roles) {
      this.email = email;
      this.roles = roles;
      this.isAuth = true;
    },
    cleanUser() {
      this.email = "";
      this.roles = [];
      this.isAuth = false;
    },

    //API && Cookies
    async login(email, password) {
      await users.getUsers().then((data) => {
        const user = data.find(
          (user) => user.email === email && user.password === password
        );

        if (user) {
          this.setUser(user.email, user.roles);
          Cookies.set("userInfo", JSON.stringify(user), { expires: 7 });
        }
      });
    },
    loadUserFromCookie() {
      if (Cookies.get("userInfo")) {
        const user = JSON.parse(Cookies.get("userInfo"));
        this.setUser(user.email, user.roles);
      }
    },
    logout() {
      this.cleanUser();
      Cookies.remove("userInfo");
    },
  },
});
