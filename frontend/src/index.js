import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css'
import './style.css';

// import bootstrap
//import 'bootstrap';
// import vue
import Vue from 'vue';
import App from './App.vue';

import VueResource from 'vue-resource';
import VueTimers from 'vue-timers'
 
Vue.use(VueResource);
Vue.use(VueTimers);

var app = new Vue({
  el: '#app',
  render: h => h(App)
});
