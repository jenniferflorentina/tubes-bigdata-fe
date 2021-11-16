<template>
  <v-dialog
    v-model="isOpen"
    max-width="70rem"
    scrollable
    transition="dialog-bottom-transition"
  >
    <v-card class="pb-4">
      <v-toolbar class="px-4" color="primary" dark>
        <v-toolbar-title>{{title}} Todo</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          class="mx-2"
          color="primary"
          small
          v-if="type === 'detail'"
          @click="type = 'edit'"
        >
          <v-icon small>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon @click="isOpen = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="my-4">
        <v-form class="px-4" ref="form" @submit.prevent="save()">
          <v-row align="center" justify="center">
            <v-col class="pb-0" cols="12" lg="6">
              <v-text-field
                v-model="createFields.title.value"
                :label="createFields.title.label"
                :rules="createFields.title.rules"
                :disabled="isFormDisabled"
              />
            </v-col>
            <v-col class="py-0" cols="12" lg="6">
              <v-menu
                v-model="createFields.deadline.showModal"
                :close-on-content-click="false"
                max-width="290px"
                min-width="auto"
                offset-y
                transition="scale-transition"
                :disabled="isFormDisabled"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="createFields.deadline.formatted"
                    v-bind="attrs"
                    v-on="on"
                    :label="createFields.deadline.label"
                    append-icon="mdi-calendar"
                    @click:append="createFields.deadline.showModal = true"
                    :rules="createFields.deadline.rules"
                    readonly
                    :disabled="isFormDisabled"
                    multi-line
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="createFields.deadline.value"
                  no-title
                  :disabled="isFormDisabled"
                  @input="formatDatePicker(createFields.deadline)"
                />
              </v-menu>
            </v-col>
            <v-col class="pb-0" cols="12">
              <v-textarea
                v-model="createFields.description.value"
                :label="createFields.description.label"
                :disabled="isFormDisabled"
              ></v-textarea>
            </v-col>
            <v-col cols="12">
              <p>{{ createFields.subTodo.label }}</p>
              <div>
                <v-row
                  class="my-0 py-0"
                  align="center"
                  v-for="(subTodo, index) in subTodos"
                  :key="index"
                >
                  <v-col>
                    <v-text-field
                      :disabled="isFormDisabled"
                      label="SubTodo Title"
                      v-model="subTodo.title"
                    />
                  </v-col>
                  <v-col cols="1">
                    <v-btn
                      v-if="type !== 'detail'"
                      @click="removeItem(index)"
                      icon
                    >
                      <v-icon color="primary">mdi-delete</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
              <v-btn
                v-if="type !== 'detail'"
                color="primary"
                width="100%"
                @click="add"
                >+Add</v-btn
              >
            </v-col>
            <v-col v-if="type !== 'create'" class="pb-0" cols="12">
              <v-text-field
                v-model="createFields.createdAt.value"
                :label="createFields.createdAt.label"
                disabled
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn v-if="type !== 'detail'" color="primary" @click="save()"
          >Save</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';
import moment from 'moment';
import BaseService from '@/services/Base';

export default Vue.extend({
  name: 'CreateDialog',
  props: ['refresh', 'createFields'],
  data: () => ({
    isOpen: false,
    id: '',
    type: '',
    title: '',
    subTodos: [
      {
        title: '',
      },
    ] as any[],
  }),

  computed: {
    isFormDisabled(): boolean {
      return this.type === 'detail';
    },
  },

  watch: {
    isOpen: {
      async handler() {
        if (this.isOpen === false) {
          (this.$refs.form as Vue & { reset: () => void }).reset();
        }
      },
    },
    type:{
      async handler(){
        this.title = this.type[0].toUpperCase() + this.type.substring(1);
      }
    }
  },

  async created() {
    this.setLoading(true);
    this.setLoading(false);
  },

  methods: {
    ...mapActions(['setLoading', 'setSnackbar']),

    async startForm(item, type : string) {
      this.isOpen = true;
      this.type = type;
      this.title = type[0].toUpperCase() + type.substring(1);
      if (type !== 'create') {
        this.fillForm(item);
        this.id = item.id;
      }
    },

    fillForm(item: any) {
      if (!item) return;
      const {
        title,
        deadline,
        description,
        subTodo,
        status,
        createdAt,
      } = item;
      const dataObj = {
        title,
        deadline: deadline?.substring(0, 10),
        description,
        subTodo,
        status,
        createdAt,
      };

      const keys = Object.keys(dataObj);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        if (key === 'subTodo') {
          this.subTodos = dataObj[key].map((item)=>{
            return {title : item};
          });
        } else if (key === 'createdAt') {
          this.createFields.createdAt.value = moment(dataObj[key]).format(
            'LLLL'
          );
        } else {
          this.createFields[key].value = dataObj[key];
        }
      }
      this.formatDatePicker(this.createFields.deadline);
    },

    add() {
      this.subTodos.push({
        title: '',
      });
    },
    removeItem(index) {
      this.subTodos = this.subTodos.filter((_, idx) => idx !== index);
    },

    onButtonClick(label) {
      (this.$refs[label] as Vue & { click: () => void }).click();
    },

    async setupPayload() {
      const payload = {
        title: this.createFields.title.value,
        deadline: this.createFields.deadline.value,
        description: this.createFields.description.value,
        subTodo: this.subTodos.map((subTodo)=>{return subTodo.title}),
        status: this.type === 'create' ? false : this.createFields.status.value,
      };
      return payload;
    },

    async save() {
      try {
        if (!this.validate()) return;
        this.setLoading(true);
        const service = new BaseService('/todo');
        // Prepare payload
        const payload = await this.setupPayload();
        if (this.type === 'create') {
          await service.post(payload);
        } else {
          await service.put(this.id, payload);
        }

        this.refresh();
        this.isOpen = false;
        this.setLoading(false);
        (this.$refs.form as Vue & { reset: () => void }).reset();
      } catch (e) {
        this.isOpen = false;
        this.setLoading(false);
        this.setSnackbar({
          isVisible: true,
          message: e,
          color: 'error',
        });
      }
    },
    validate() {
      return (
        this.$refs.form as Vue & {
          validate: () => boolean;
        }
      ).validate();
    },

    formatDatePicker(field) {
      field.formatted = moment(field.value).format('DD-MM-YYYY');
      field.showModal = false;
    },
  },
});
</script>
