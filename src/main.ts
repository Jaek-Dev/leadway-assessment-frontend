import "./assets/main.css";
import "nprogress/nprogress.css";
import "vue-toast-notification/dist/theme-bootstrap.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import ToastPlugin from "vue-toast-notification";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ToastPlugin);

app.mount("#app");
