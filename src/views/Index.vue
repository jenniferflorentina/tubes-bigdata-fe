<template>
  <div class="container">
    <h1>To Do List</h1>
    <section class="mx-4 my-16">
      <v-row class="mx-0 mb-2" justify="end">
        <v-btn
          v-if="selectedTodo.length !== 0"
          class="ml-2"
          color="primary"
          @click="promptDeleteItems()"
        >
          <v-icon small>mdi-delete</v-icon>
        </v-btn>
        <v-btn
          class="ml-2"
          color="primary"
          @click="openCreateForm(null, 'create')">
            <v-icon small>mdi-card-plus-outline</v-icon>
        </v-btn>
      </v-row>
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
              <v-btn icon v-if="!item.status">
                <v-icon small @click="markAsDone(item, true)">mdi-check</v-icon>
              </v-btn>
              <v-btn icon v-if="item.status">
                <v-icon small @click="markAsDone(item, false)">mdi-close</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon small @click="openCreateForm(item, 'detail')">mdi-eye</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon small @click="openCreateForm(item, 'edit')">mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon small @click="promptDeleteItem(item.id)">mdi-delete</v-icon>
              </v-btn>
            </div>
            <div v-else>
              {{ setItemTable(item, header.value) }}
            </div>
          </div>
        </template>
      </v-data-table>
    </section>
    <CreateDialog
      ref="createMainDialog"
      :createFields="createFields"
      :refresh="refresh"
    />
    <DeleteConfirmDialog
      ref="deleteMainDialog"
    />
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';
import BaseService from "@/services/Base";
import validation from '@/validation/index';
import CreateDialog from '@/views/CreateDialog.vue';
import DeleteConfirmDialog from '@/views/DeleteConfirmDialog.vue';

export default Vue.extend({
  name: 'Index',
  components: {
    CreateDialog,
    DeleteConfirmDialog
  },
  data: () => ({
    // Data General,
    items: [] as any[],
    deletedId: '',
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
        value: 'description',
        dataType: 'string',
      },
      {
        text: 'Status',
        align: 'left',
        value: 'status',
        dataType: 'string',
      },
      {
        text: 'Actions',
        value: 'action',
        align: 'center',
        width: '160px',
      },
    ],
    createFields: {
      title: {
        label: 'Title',
        type: 'string',
        value: '',
        rules: [
          validation.required('Title'),
        ],
      },
      deadline: {
        label: 'Deadline',
        type: 'date',
        value: '',
        formatted: '',
        showModal: false,
        rules: [
          validation.required('Deadline'),
        ],
      },
      description: {
        label: 'Description',
        type: 'string',
        value: '',
        rules: [],
      },
      subTodo: {
        label: 'SubTodo',
        type: 'string',
        value: [],
        rules: [],
      },
      status: {
        label: 'Status',
        type: 'boolean',
        value: false,
        rules: [],
      },
      createdAt: {
        label: 'Created At',
        type: 'string',
        value: '',
      },
    },
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
      const service = new BaseService('/todo');
      const res = await service.get(params);
      this.items = res.data? res.data : [];
      this.$forceUpdate();
    },

    setItemTable(item, headerValue) {
      switch (headerValue) {
        case "status":
          return item[headerValue]? 'Done' : 'Not Done';
        default:
          return item[headerValue];
      }
    },

    promptDeleteItems() {
      if (this.selectedTodo.length === 0) return;
      const dialog: any = this.$refs.deleteMainDialog;
      dialog.toggleShowModal(this.deleteItems);
    },

    promptDeleteItem(id) {
      this.deletedId = id;
      const dialog: any = this.$refs.deleteMainDialog;
      dialog.toggleShowModal(this.deleteItem);
    },

    async deleteItem() {
      try {
        this.setLoading(true);
        const service = new BaseService('/todo');

        await service.delete(this.deletedId);

        this.refresh();
        this.setLoading(false);
      } catch (e) {
        this.setLoading(false);
        this.setSnackbar({
          isVisible: true,
          message: e,
          color: 'error',
        });
      }
    },

    async deleteItems() {
      try {
        this.setLoading(true);
        const taskIds = this.selectedTodo.map((task) => {
          return task.id;
        });
        const service = new BaseService('/todo');

        await service.deleteMultiple(`listToDelete=${taskIds}`);

        this.refresh();
        this.setLoading(false);
      } catch (e) {
        this.setLoading(false);
        this.setSnackbar({
          isVisible: true,
          message: e,
          color: 'error',
        });
      }
    },

    async markAsDone(item, isDone) {
      try {
        this.setLoading(true);
        const service = new BaseService('/todo');
        // Prepare payload
        const payload = {
          title: item.title,
          deadline: item.deadline,
          description: item.description,
          subTodo: item.subTodo,
          status: isDone,
        }
        await service.put(item.id, payload);

        this.refresh();
        this.setLoading(false);
      } catch (e) {
        this.setLoading(false);
        this.setSnackbar({
          isVisible: true,
          message: e,
          color: 'error',
        });
      }
    },

    openCreateForm(item, type) {
      const { createMainDialog }: any = this.$refs;
      createMainDialog.startForm(item, type);
    },
  },
});
</script>
