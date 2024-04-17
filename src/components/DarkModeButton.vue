
<template>
   <q-btn class="absolute-bottom-right border-radius-inherit fa-border-all" icon="light" @click="toggleDarkMode" />
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
