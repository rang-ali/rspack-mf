import { createApp } from "vue";

import "./index.scss";

import Counter from "./Counter.vue";

export default function counterMounter(element) {
  createApp(Counter).mount(element);
}
