<template>
  <div class="form-content column justify-center no-wrap">
    <div class="text-weight text-h5 q-py-md">Login</div>

    <q-form
      @submit="formSubmit"
      class="full-width q-gutter-y-lg q-pa-md column"
    >
      <!-- login form input -->
      <q-input
        v-model="email"
        label="Email Address"
        :rules="[
          (val) => (val && val.length > 0) || 'Please Enter a User name',
        ]"
      >
        <template #prepend>
          <q-icon name="mail" />
        </template>
      </q-input>
      <q-input
        v-model="password"
        label="Password"
        :type="showPassword ? 'text' : 'password'"
      >
        <template #prepend>
          <q-icon name="lock" />
        </template>
        <template #append>
          <q-icon
            :name="showPassword ? 'visibility' : 'visibility_off'"
            @click="showPassword = !showPassword"
          ></q-icon>
        </template>
      </q-input>

      <!-- forgot password btn -->
      <div class="row justify-between no-wrap">
        <q-checkbox disable label="Remember me" v-model="keepMeLogin" size="34px" />
        <q-btn label="Forgot password ?" no-caps flat color="primary" />
      </div>

      <!-- login submit btn -->
      <q-btn
        label="Login"
        no-caps
        color="primary"
        rounded
        class="q-pa-sm"
        type="submit"
      />
    </q-form>

    <!-- login form end -->

    <div class="row q-gutter-x-sm self-bottom no-wrap">
      <div class="q-my-auto">Dont't have an account yet ?</div>
      <span
        class="text-primary cursor-pointer"
        style="text-decoration: underline"
        @click="$router.push({ name: 'register' })"
        >Sign up</span
      >
    </div>
  </div>
</template>
<script>
import { ref } from "vue";

import { useQuasar } from "quasar";
import { useAuthStore } from "src/stores/useAuthStore";
import { useRouter } from "vue-router";
import { api } from "src/boot/axios";

export default {
  name: "login_page",
  setup() {
    const email = ref("");
    const password = ref("");
    const keepMeLogin = ref(true);
    const showPassword = ref(false);

    const $q = useQuasar();
    const authStore = useAuthStore();
    const router = useRouter();

    function formSubmit() {
      api({
        url: "login",
        method: "POST",
        params: {
          username: email.value,
          password: password.value,
        },
        auth: {
          username: email.value,
          password: password.value,
        },
      })
        .then(async (res) => {
          const response_status_code = res.status;
          const response_api_key = res.data.apiKey;
          const response_userInfo = res.data.customerInfo;
          const response_sessionToken = res.data.moquiSessionToken;

          if (response_status_code === 200) {
            authStore.setAuthenticate(
              keepMeLogin.value,
              response_api_key,
              response_sessionToken,
              response_userInfo
            );

            router.push({ name: "home" });

            //login success
            $q.notify({
              message: "Login success",
              color: "green",
              icon: "done",
              position: "top-right",
              timeout: 3000,
            });
          }
        })
        .catch((err) => {
          // password.value = "";
          console.log(err);
          alert(err);

          $q.notify({
            message: err,
            icon: "cancel",
            color: "negative",
            position: "top-right",
          });
        });
    }

    return {
      formSubmit,
      email,
      password,
      keepMeLogin,
      showPassword,
      authStore,
    };
  },
};
</script>
