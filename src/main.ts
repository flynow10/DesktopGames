import { createApp } from "vue";
import App from "./App.vue";
import "./assets/scss/index.scss";
import { EventManager } from "./core/EventManager";

window.EventManager = new EventManager();

createApp(App)
  .mount("#app")
  .$nextTick(() => {
    postMessage({ payload: "removeLoading" }, "*");
  });
