import { defineStore } from "pinia";
import { ref } from "vue";
import { api } from "src/boot/axios";
import { useAuthStore } from "./useAuthStore";

const useAuth = useAuthStore();
export const useVendorStore = defineStore("vendors", () => {
  const allVendorList = ref([]);
  const tempVendorList = ref([]);

  function getVendors(vendorList) {
    allVendorList.value = [];
    allVendorList.value.push(...vendorList);
  }

  function searchVendor(val) {
    console.log(val);
    if (val == "") {
      tempVendorList.value = [];
    } else {
      api({
        method: "GET",
        url: `vendors?anyField=${val}`,
        headers: useAuth.authKey,
      }).then((res) => {
        tempVendorList.value = [];

        res.data.documentList.map((data) => {
          tempVendorList.value.push(data);
        });
      });
    }
  }

  return {
    allVendorList,
    tempVendorList,
    getVendors,
    searchVendor,
  };
});
