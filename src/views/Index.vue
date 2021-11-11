<template>
  <div class="container">
    <h1>To Do List</h1>
    <section class="mx-4 my-16">
      <v-data-table
        :headers="headers"
        :items="items"
        item-key="id"
        show-select
        hide-default-footer
        v-model="selectedTodo"
        class="mt-6 row-pointer"
      >
        <template
          v-for="(header, i) in headers"
          v-slot:[`item.${header.value}`]="{ item }"
        >
          <div :key="i">
            <div
              v-if="header.value === 'action'"
              class="d-flex align-center justify-center"
            >
              <v-btn icon>
                <v-icon small>mdi-eye</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon small>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon small>mdi-delete</v-icon>
              </v-btn>
            </div>
            <div v-else>
              {{ setItemTable(item, header.value) }}
            </div>
          </div>
        </template>
      </v-data-table>
    </section>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import BaseService from "@/services/Base";

export default Vue.extend({
  name: 'Index',

  data: () => ({
    // Data General,
    items: [] as any[],
    selectedTodo: [] as any,
    headers: [
      {
        text: 'ID',
        align: 'left',
        value: 'id',
      },
      {
        text: 'Title',
        align: 'left',
        value: 'title',
        dataType: 'string',
      },
      {
        text: 'Description',
        align: 'left',
        value: 'desc',
        dataType: 'string',
      },
      {
        text: 'Actions',
        value: 'action',
        align: 'center',
        width: '160px',
      },
    ],
  }),

  async created() {
    this.setLoading(true);
    await this.refresh();
    this.setLoading(false);
  },

  methods: {
    ...mapActions(['setLoading', 'setSnackbar']),
    async refresh() {
      try {
        await this.request('');
      } catch (e) {
        this.setSnackbar({
          isVisible: true,
          message: e,
          color: 'error',
        });
      } finally {
        this.setLoading(false);
      }
    },
    async request(params) {
      this.setLoading(true);
      const service = new BaseService('/getAll');
      const res = await service.get(params);
      this.items = res.data;
      this.$forceUpdate();
    },

    setItemTable(item, headerValue) {
      return item[headerValue];
    },
  },
});
</script>
