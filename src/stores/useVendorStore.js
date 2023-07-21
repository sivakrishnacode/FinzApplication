import { defineStore } from "pinia";
import { onMounted, ref } from "vue";

import { api } from "src/boot/axios";
import { useAuthStore } from "./useAuthStore";

export const useVendorStore = defineStore("vendor", () => {
  const vendorDetails = ref("");

  async function getVendorDetails(id) {
    await api({
      method: "GET",
      url: `vendors/${id}/contactInfo`,
      headers: useAuthStore().authKey,
    }).then((res) => {
      vendorDetails.value = res.data;
    });
  }

  return {
    getVendorDetails,
    vendorDetails,
  };
});
