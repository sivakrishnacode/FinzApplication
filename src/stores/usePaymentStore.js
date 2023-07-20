import { defineStore } from "pinia";
import { onMounted, ref } from "vue";

import { api } from "src/boot/axios";
import { useAuthStore } from "./useAuthStore";

export const usePaymentStore = defineStore("payment", () => {
  const paymentStatusProp = ref([]);
  const useAuth = useAuthStore();

  function getStatusProp() {
    api({
      method: "GET",
      url: "status",
      headers: useAuth.authKey,
      params: {
        statusTypeId: "payment",
      },
    })
      .then((res) => {
        res.data.statusItemList.map((data) => {
          paymentStatusProp.value.push(data);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // payment type
  const paymentTypeProp = (statusId) => {
    const colors = [
      {
        statusId: "PtRefund",
        color: "orange-9",
        message: "Refunded",
      },
      {
        statusId: "PtInvoicePayment",
        color: "green-10",
        message: "Invoice Payment",
      },
    ];

    const data = colors.find((data) => {
      if (data.statusId == statusId) {
        return data;
      }
    });

    if (data) {
      return data;
    }
  };

  onMounted(() => {
    getStatusProp();
  });

  return {
    paymentStatusProp,
    paymentTypeProp,
  };
});
