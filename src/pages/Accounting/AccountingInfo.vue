<template>
  <div>acc info {{ acctgTransId }}</div>
</template>

<script>
import { onMounted } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "accountingInfo_page",
  setup() {
    const route = useRoute();

    var acctgTransId = route.params.acctgTransId;
    onMounted(() => {
      console.log(acctgTransId);
    });
    return {
      acctgTransId,
    };
  },
};
</script>

<style lang="scss" scoped></style>
