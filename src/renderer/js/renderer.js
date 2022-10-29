import "../scss/index.scss";
import { createApp } from "vue";
import App from "./App.vue";
import { EventManager } from "./core/EventManager";

window.EventManager = new EventManager();

createApp(App).mount("#app");
