import '@/scss/syncfusion.scss';
import VueMask from 'v-mask';
import Vue from 'vue';
import VueFeather from 'vue-feather';
import VueSkycons from 'vue-skycons';
import Vuebar from 'vuebar';
import DatetimePicker from 'vuetify-datetime-picker';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';
import store from './store';

Vue.config.productionTip = false;
Vue.use(VueMask);
Vue.use(VueFeather);
Vue.use(VueSkycons, {
  color: '#1e88e5',
});
Vue.use(Vuebar);
Vue.use(DatetimePicker);

router.beforeEach((to, from, next) => {
  next();
});

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
