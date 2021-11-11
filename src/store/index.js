import Vue from 'vue';
import Vuex from 'vuex';

// eslint-disable-next-line import/no-cycle
import global from '@/store/modules/global';
// eslint-disable-next-line import/no-cycle
import table from '@/store/modules/table';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    global,
    table,
  },
  state: {
    sidebarDrawer: null,
    customizerDrawer: false,
    sidebarColor: '#c80b0e', // Change Sidebar Color || 'white', | "#2b2b2b" | "rgb(44, 59, 164)" | "rgb(96, 44, 164)" | "rgb(151, 210, 219)" | "rgb(77, 86, 100)"
    SidebarBg: '',
    navbarColor: 'white',
    setHorizontalLayout: false, // Horizontal layout
  },
  mutations: {
    SET_SIDEBAR_DRAWER(state, payload) {
      state.sidebarDrawer = payload;
    },
    SET_CUSTOMIZER_DRAWER(state, payload) {
      state.customizerDrawer = payload;
    },
    SET_SIDEBAR_COLOR(state, payload) {
      state.sidebarColor = payload;
    },
    SET_NAVBAR_COLOR(state, payload) {
      state.navbarColor = payload;
    },
    SET_LAYOUT(state, payload) {
      state.setHorizontalLayout = payload;
    },
  },
  actions: {},
  getters: {},
});
