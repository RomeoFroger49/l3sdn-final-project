<template>
  <div @click="toggleDarkMode">
    <q-icon :name="this.$q.dark.isActive ? 'light_mode' : 'dark_mode'" />
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DarkModeButton',
  methods: {
    toggleDarkMode() {
      this.$q.dark.set(!this.$q.dark.isActive);
    }
  }
});
</script>
