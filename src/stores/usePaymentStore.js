import { defineStore } from "pinia";
import { onMounted, ref } from "vue";

import { api } from "src/boot/axios";
import { useAuthStore } from "./useAuthStore";

export const usePaymentStore = defineStore("payment", () => {
  const paymentStatusProp = ref([
    // {
    //   statusId: "PmntAuthorized",
    //   statusTypeId: "Payment",
    //   sequenceNum: 3,
    //   description: "Authorized",
    //   lastUpdatedStamp: 1687850657370,
    //   color: "green-10",
    // },
    // {
    //   statusId: "PmntCancelled",
    //   statusTypeId: "Payment",
    //   sequenceNum: 91,
    //   description: "Cancelled",
    //   lastUpdatedStamp: 1687850657370,
    //   color: "green-10",
    // },
    {
      statusId: "PmntConfirmed",
      statusTypeId: "Payment",
      sequenceNum: 6,
      description: "Confirmed Paids",
      lastUpdatedStamp: 1687850657370,
      color: "indigo-9",
    },
    // {
    //   statusId: "PmntDeclined",
    //   statusTypeId: "Payment",
    //   sequenceNum: 93,
    //   description: "Declined",
    //   lastUpdatedStamp: 1687850657370,
    // },
    {
      statusId: "PmntDelivered",
      statusTypeId: "Payment",
      sequenceNum: 4,
      description: "Delivered",
      lastUpdatedStamp: 1687850657370,
      color: "purple-7",
    },
    // {
    //   statusId: "PmntPromised",
    //   statusTypeId: "Payment",
    //   sequenceNum: 2,
    //   description: "Promised",
    //   lastUpdatedStamp: 1687850657370,
    // },
    // {
    //   statusId: "PmntProposed",
    //   statusTypeId: "Payment",
    //   sequenceNum: 1,
    //   description: "Proposed",
    //   lastUpdatedStamp: 1687850657370,
    // },
    // {
    //   statusId: "PmntVoid",
    //   statusTypeId: "Payment",
    //   sequenceNum: 92,
    //   description: "Void",
    //   lastUpdatedStamp: 1687850657370,
    // },
  ]);

  // function getStatusProp() {
  //   api({
  //     method: "GET",
  //     url: "status",
  //     headers: useAuthStore().authKey,
  //     params: {
  //       statusTypeId: "payment",
  //     },
  //   })
  //     .then((res) => {
  //       res.data.statusItemList.map((data) => {
  //         paymentStatusProp.value.push(data);
  //       });
  //       console.log(paymentStatusProp.value);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }

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
    //getStatusProp();
  });

  return {
    paymentStatusProp,
    paymentTypeProp,
  };
});
