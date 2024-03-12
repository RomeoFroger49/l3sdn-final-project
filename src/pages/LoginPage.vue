<template>
  <div class="container">
    <h3 class="title">Se connecter | rhTool</h3>
    <q-input
      v-model="email"
      filled
      type="email"
      hint="Email"
      class="input"
      color=""
    />
    <q-input
      v-model="password"
      filled
      :type="isPwd ? 'password' : 'text'"
      hint="Password"
      class="input"
    >
      <template v-slot:append>
        <q-icon
          :name="isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="togglePasswordVisibility"
        />
      </template>
    </q-input>
    <q-btn color="black" label="connexion" @click="login" />
  </div>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import { useAuthStore } from "src/stores/auth-store";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "LoginPage",
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const email = ref("");
    const password = ref("");
    const isPwd = ref(true);

    const togglePasswordVisibility = () => {
      isPwd.value = !isPwd.value;
    };

    const login = () => {
      authStore.login(email.value, password.value).then(() => {
        if (authStore.isAuthenticated) {
          console.log("logged in", authStore.getUser, authStore.isAuth);
          router.push({ path: "/" });
        } else {
          console.log("login failed", authStore.getUser);
        }
      });
    };

    return {
      email,
      password,
      isPwd,
      togglePasswordVisibility,
      login,
    };
  },
});
</script>

<style>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: auto;
  width: 50%;
  height: 80vh;
}

.input {
  width: 300px;
  padding-bottom: 2rem;
}
.title {
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: bold;
  color: #1976d2;
  text-align: center;
}
</style>
