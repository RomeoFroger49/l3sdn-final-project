<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  computed: {
    darkModeClass() {
      return this.$q.dark.isActive ? 'body--dark' : '';
    }
  },

  watch: {
    darkModeClass(newClass) {
      document.body.className = newClass;
    }
  },

  mounted() {
    this.$watch(() => this.$q.dark.isActive, (isDark) => {
      document.body.className = isDark ? 'body--dark' : '';
    }, { immediate: true });
  }
});
</script>
