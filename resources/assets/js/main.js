// resources/assets/js/main.js

import Vue from "vue";
import router from "./router";
import App from "@/App";

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>"
});
