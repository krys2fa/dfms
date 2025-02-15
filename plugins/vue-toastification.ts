import { defineNuxtPlugin } from "#app";
import Toast, { PluginOptions } from "vue-toastification";
import "vue-toastification/dist/index.css";

export default defineNuxtPlugin((nuxtApp) => {
  const options: PluginOptions = {
    position: "top-right",
    timeout: 3000,
    closeOnClick: true,
    draggable: true,
  };

  nuxtApp.vueApp.use(Toast, options);
});
