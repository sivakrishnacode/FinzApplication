import { defineStore } from "pinia";
import { ref } from "vue";

export const useVendorStore = defineStore("vendors", () => {
  const allVendorList = ref([]);
  const tempVendorList = ref([]);

  function getVendors(vendorList) {
    allVendorList.value = [];
    allVendorList.value.push(...vendorList);
  }

  function searchVendor(vendorList) {
    tempVendorList.value = [];
    tempVendorList.value.push(...vendorList);
  }

  return {
    allVendorList,
    tempVendorList,
    getVendors,
    searchVendor,
  };
});
