import { defineStore } from "pinia";
import { onMounted, ref } from "vue";

import { api } from "src/boot/axios";
import { useAuthStore } from "./useAuthStore";

export const useGeosStore = defineStore("geos", () => {
  const useAuth = useAuthStore();
  const countryList = ref([]);
  const stateList = ref([]);

  async function getCountyList() {
    await api({
      method: "GET",
      url: "geos",
      headers: useAuth.authKey,
    })
      .then((res) => {
        res.data.geoList.map((data) => {
          countryList.value.push(data);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function getStateList(geoId) {
    stateList.value = [];

    api({
      method: "GET",
      url: `geos/${geoId}/regions`,
      headers: useAuth.authKey,
    }).then((res) => {
      const data = res.data.resultList;

      stateList.value.push(...data);
    });
  }

  onMounted(() => {
    getCountyList();
  });

  return {
    countryList,
    stateList,
    getStateList,
  };
});
