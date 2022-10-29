import { EventManager } from "./core/EventManager";
import Vue from "vue";

declare global {
  interface Window {
    EventManager: EventManager;
  }
}
declare module "*.vue" {
  export default Vue;
}
