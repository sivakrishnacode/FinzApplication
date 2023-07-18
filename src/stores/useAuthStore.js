import { defineStore } from "pinia";
import { ref } from "vue";

import axios from "axios";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", () => {
  const isAuthenticated = ref(false);
  const user = ref({});
  const authKey = ref({});

  const router = useRouter();

  async function setAuthenticate(isKeepMeEnable, apiKey, sessionKey, userInfo) {
    if (isKeepMeEnable) {
      localStorage.setItem("apiKey", apiKey);
      localStorage.setItem("isKeepMeEnable", isKeepMeEnable);
      localStorage.setItem("userInfo", JSON.stringify(userInfo));

      localStorage.setItem("auth", true);

      authKey.value = { api_key: apiKey };
      user.value = JSON.stringify(userInfo);
      isAuthenticated.value = true;
    } else {
      localStorage.setItem("sessionKey", sessionKey);
      localStorage.setItem("userInfo", JSON.stringify(userInfo));

      localStorage.setItem("auth", true);

      authKey.value = { moquiSessionToken: sessionKey };
      user.value = JSON.stringify(userInfo);
      isAuthenticated.value = true;
    }
  }

  async function isLoggedIn() {
    const isKeepMeEnable = localStorage.getItem("isKeepMeEnable") === null;
    const isSessionKey = localStorage.getItem("sessionKey") === null;

    if (!isKeepMeEnable) {
      //api based

      const apiKey = localStorage.getItem("apiKey");
      const userInfo = localStorage.getItem("userInfo");

      user.value = userInfo;
      authKey.value = { api_key: apiKey };
      isAuthenticated.value = true;
    } else if (!isSessionKey) {
      //session based

      const sessionKey = localStorage.getItem("sessionKey");
      const userInfo = localStorage.getItem("userInfo");

      user.value = userInfo;
      authKey.value = { moquiSessionToken: sessionKey };
      isAuthenticated.value = true;
    } else {
      isAuthenticated.value = false;
    }
  }

  async function logout() {
    axios({
      url: "http://localhost:8080/rest/s1/finzApp/logout",
      method: "GET",
      withCredentials: true,
      headers: authKey.value,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    localStorage.clear();

    user.value = {};
    authKey.value = {};
    router.push({
      name: "login",
    });
  }

  isLoggedIn();

  return {
    isAuthenticated,
    setAuthenticate,
    authKey,
    user,
    logout,
  };
});
