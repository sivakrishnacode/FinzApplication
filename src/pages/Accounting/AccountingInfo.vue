<template>
  <div>acc info {{ accTransId }}</div>
</template>

<script>
import { onMounted } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "accountingInfo_page",
  setup() {
    const route = useRoute();

    var accTransId = route.params.accTransId;
    onMounted(() => {
      console.log(accTransId);
    });
    return {
      accTransId,
    };
  },
};
</script>

<style lang="scss" scoped></style>
