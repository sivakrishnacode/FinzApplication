<template>
  <div>siva</div>
</template>

<script>
import { useRoute } from "vue-router";

export default {
  name: "paymentInfo_page",
  setup() {
    const route = useRoute();

    const paymentId = route.params.paymentId;

    return {
      paymentId,
    };
  },
};
</script>

<style>
::-webkit-scrollbar {
  display: none;
}
</style>
