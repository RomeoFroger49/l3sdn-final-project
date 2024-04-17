<template>
  <router-view />
  <DarkModeButton />
</template>

<script>
import { defineComponent } from 'vue';
import DarkModeButton from './components/DarkModeButton.vue';

export default defineComponent({
  name: 'App',
  components: {
    DarkModeButton
  }
});
</script>
