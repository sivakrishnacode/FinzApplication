<template>
  <router-view />
</template>

<script>
import { defineComponent, onMounted } from "vue";

export default defineComponent({
  name: "App",
  setup() {
    onMounted(() => {
      // add script
      var tempScript = document.createElement("script");
      tempScript.setAttribute(
        "src",
        "https://documentservices.adobe.com/view-sdk/viewer.js"
      );
      document.head.appendChild(tempScript);
    });
  },
});
</script>
