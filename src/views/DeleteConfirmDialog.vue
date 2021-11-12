<template>
  <v-dialog
      v-model="showModal"
      max-width="600px"
      persistent
  >
    <v-card>
      <v-card-title>
        <span>{{ title }}</span>
      </v-card-title>
      <v-card-text>
        {{ description }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="blue darken-1"
            text
            @click="showModal = false"
        >
          Close
        </v-btn>
        <v-btn
            color="error"
            @click="actionDelete()"
        >
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data: () => ({
    showModal: false,
    description: "Are you sure you want to delete this item? This action cannot be undone",
    title: "Delete Item"
  }),
  methods: {
    deleteItem: () => ({}),
    toggleShowModal(deleteItem) {
      this.deleteItem = deleteItem;
      this.showModal = !this.showModal;
    },
    actionDelete() {
      this.deleteItem();
      this.showModal = false;
    },
    actionChangeTabs() {
      this.showModal = false;
    },
  },
});
</script>
