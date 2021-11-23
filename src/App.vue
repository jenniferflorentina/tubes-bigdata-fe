<template>
  <v-app>
    <router-view />
    <v-snackbar
      v-model="snackbar.isVisible"
      :color="snackbar.color"
      :timeout="3000"
      absolute
      bottom
      class="mb-16"
    >
      {{ snackbar.message }}
      <template v-slot:action="{ attrs }">
        <v-btn v-bind="attrs" color="red" text @click="closeSnackbar()">
          Close
        </v-btn>
      </template>
    </v-snackbar>
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
