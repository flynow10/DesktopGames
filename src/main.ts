import { createApp } from "vue";
import App from "./App.vue";
import { EventManager } from "@/core/EventManager";
import "@/assets/scss/index.scss";

window.EventManager = new EventManager();

createApp(App)
  .mount("#app")
  .$nextTick(() => {
    postMessage({ payload: "removeLoading" }, "*");
  });
