<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapMutations } from 'vuex';
import { Route } from 'vue-router';

export default Vue.extend({
  name: 'App',
  components: {},
  computed: {
    ...mapGetters(['token', 'snackbar']),
  },
  data: () => ({
    route: null as Route | null,
  }),
  async created() {
    this.route = this.$route;
  },
  methods: {
    ...mapMutations(['setSnackbar']),
    closeSnackbar() {
      const snackbar = {
        isVisible: false,
        message: '',
        color: '',
      };
      this.setSnackbar(snackbar);
    },
  },
});
</script>
