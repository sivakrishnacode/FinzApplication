import { defineStore } from "pinia";
import { onMounted, ref } from "vue";

import { api } from "src/boot/axios";
import { useAuthStore } from "./useAuthStore";

export const useInvoicesStore = defineStore("invoices", () => {
  const invoiceStatusProp = ref([]);
  const useAuth = useAuthStore();

  function getStatusProp() {
    api({
      method: "GET",
      url: "status",
      headers: useAuth.authKey,
      params: {
        statusTypeId: "invoice",
      },
    })
      .then((res) => {
        res.data.statusItemList.map((data) => {
          invoiceStatusProp.value.push(data);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onMounted(() => {
    getStatusProp();
  });

  return {
    invoiceStatusProp,
  };
});
