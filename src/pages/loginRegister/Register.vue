<template>
  <div class="form-content no-wrap column justify-center">
    <div class="text-weight text-h5 q-pa-sm">Register</div>

    <q-form
      @submit="createUser"
      class="full-width q-gutter-y-sm q-pa-md no-wrap column"
    >
      <q-input
        v-model="userData.firstName"
        label="First name"
        :rules="[
          (val) => (val && val.length > 0) || 'First Name Required',
          (val) => (val && val.length > 2) || 'Enter minimun 2 letters',
        ]"
      >
      </q-input>
      <q-input
        v-model="userData.lastName"
        label="Last name"
        :rules="[(val) => (val && val.length > 0) || 'Field Required']"
      >
      </q-input>

      <q-input
        v-model="userData.emailAddress"
        label="Email address"
        :rules="[
          (val) => (val && val.length > 0) || 'Please Enter a Email address',
          (val) =>
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val) ||
            'Please enter a valid email address',
        ]"
      >
      </q-input>

      <q-input
        v-model="userData.newPassword"
        label="Password"
        :rules="[
          (val) => (val && val.length > 0) || 'Please Enter a password',
          (val) => val.length >= 8 || 'Please use minimum 8 characters',
          (val) =>
            checkPasswordHaveSpecialChar ||
            'Password must contain at least one special character',
        ]"
        :type="showPassword ? 'text' : 'password'"
      >
        <template #append>
          <q-icon
            :name="showPassword ? 'visibility' : 'visibility_off'"
            @click="showPassword = !showPassword"
          ></q-icon>
        </template>
      </q-input>
      <q-input
        v-model="userData.newPasswordVerify"
        :disable="!checkIsPasswordValid"
        type="password"
        label="Confirm password"
        @update:model-value="isPasswordVerifyTyping"
        :rules="[(val) => val === userData.newPassword || 'Password not match']"
      >
        <template #append>
          <q-spinner-ios v-if="loadingState" color="primary" size="1em" />
          <q-icon
            v-if="isPassworMatch && checkIsPasswordValid"
            name="done"
            color="positive"
          ></q-icon>
        </template>
      </q-input>
      <q-btn
        label="Register"
        no-caps
        color="primary"
        rounded
        class="q-pa-sm text-bold"
        type="submit"
      />
    </q-form>

    <div class="row q-gutter-x-sm self-bottom">
      <div class="q-my-auto">Already have a Account?</div>
      <span
        class="text-primary cursor-pointer"
        style="text-decoration: underline"
        @click="$router.push({ name: 'login' })"
        >Sign in</span
      >
    </div>
  </div>
</template>
<script>
import { ref, computed } from "vue";
import { api } from "src/boot/axios";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

export default {
  name: "register_page",
  setup() {
    const $q = useQuasar();
    const router = useRouter();

    const isPasswordValid = ref(true);
    const showPassword = ref(true);
    const loadingState = ref(false);

    const userData = ref({
      firstName: "",
      lastName: "",
      username: "",
      emailAddress: "",
      newPassword: "",
      newPasswordVerify: "",
    });

    const checkPasswordHaveSpecialChar = computed(() => {
      return /[!@#$%^&*(),.?\":{}|<>]/.test(userData.value.newPassword.trim());
    });

    const checkIsPasswordValid = computed(() => {
      if (
        userData.value.newPassword.length >= 8 &&
        checkPasswordHaveSpecialChar.value
      ) {
        return true;
      } else {
        return false;
      }
    });

    function isPasswordVerifyTyping() {
      loadingState.value = true;
      setTimeout(() => {
        loadingState.value = false;
      }, 500);
    }

    const isPassworMatch = computed(() => {
      return (
        userData.value.newPassword.trim() ===
        userData.value.newPasswordVerify.trim()
      );
    });

    function createUser() {
      api({
        method: "POST",
        url: "register",
        params: {
          firstName: userData.value.firstName,
          lastName: userData.value.lastName,
          username: userData.value.emailAddress,
          emailAddress: userData.value.emailAddress,
          newPassword: userData.value.newPassword,
          newPasswordVerify: userData.value.newPasswordVerify,
        },
      })
        .then((res) => {
          $q.notify({
            message: res.message,
            color: "positive",
          });
          router.push({ name: "login" });
        })
        .catch((err) => {
          $q.notify({
            message: "user not registered",
            color: "negative",
          });
        });
    }

    return {
      userData,
      createUser,
      checkPasswordHaveSpecialChar,
      isPasswordValid,
      checkIsPasswordValid,
      showPassword,
      isPassworMatch,
      loadingState,
      isPasswordVerifyTyping,
    };
  },
};
</script>
