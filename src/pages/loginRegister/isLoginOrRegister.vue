<template>
  <div
    class="row justify-center items-center bg-primary overflow-auto"
    style="width: 100%; height: 100vh"
  >
    <q-card class="main q-py-md">
      <div class="side-content" v-if="$q.screen.gt.sm">
        <q-img
          fit
          width="100%"
          height="100%"
          style="border-radius: 18px"
          src="https://img.freepik.com/free-vector/web-development-programmer-engineering-coding-website-augmented-reality-interface-screens-developer-project-engineer-programming-software-application-design-cartoon-illustration_107791-3863.jpg?w=1380&t=st=1680152402~exp=1680153002~hmac=0cf3d727ec7fcc73747e798a2e49850cab3c137fdfe0bd972102956e0647dff2"
        />
      </div>
      <q-separator vertical v-if="$q.screen.gt.sm" />

      <!-- login form or register form -->

      <component :is="$route.name === 'login' ? Login : Register" />
    </q-card>
  </div>
</template>
<script>
import Login from "./Login.vue";
import Register from "./Register.vue";

export default {
  components: {
    Login,
    Register,
  },
  setup() {
    return {
      Login,
      Register,
    };
  },
};
</script>

<style>
.main {
  width: 60%;
  height: auto;
  min-width: auto;
  display: flex;
  min-width: 320px;
  border-radius: 18px;
}

.main .side-content {
  width: 160%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
}

.main .form-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
