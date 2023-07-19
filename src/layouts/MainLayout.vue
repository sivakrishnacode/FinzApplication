<template>
  <q-layout view="lHh lpR lFf">
    <q-header bordered class="bg-white">
      <q-toolbar class="q-py-sm" :class="$q.dark.isActive ? 'bg-dark' : ''">
        <q-btn
          icon="menu"
          round
          flat
          title="menu"
          @click="drawer = !drawer"
          color="primary"
        />
        <q-toolbar-title
          class="text-center text-primary text-bold"
          style="font-size: 25px"
        >
          FINZ</q-toolbar-title
        >
        <div class="q-gutter-x-md no-wrap">
          <q-btn dense color="primary" round icon="notifications" flat>
            <q-badge color="red" floating>2</q-badge>
          </q-btn>

          <q-btn-dropdown
            icon="account_circle"
            round
            flat
            title="profile"
            color="primary"
          >
            <q-card>
              <q-card-section>
                <div class="row no-wrap q-pa-md">
                  <div class="column">
                    <div class="text-h6 q-mb-md">Settings</div>
                    <q-toggle
                      v-model="isDark"
                      style="border-radius: 15px"
                      class="q-pa-sm"
                      color="primary"
                      label="Theme"
                      checked-icon="dark_mode"
                      unchecked-icon="light_mode"
                    />
                  </div>

                  <q-separator vertical class="q-mx-lg" />

                  <div class="column items-center">
                    <q-avatar size="72px" class="bg-primary">
                      <div>
                        {{ JSON.parse(useAuth?.user)?.firstName.charAt(0) }}
                      </div>
                    </q-avatar>

                    <div class="text-h6 q-mt-md q-mb-xs">
                      {{ JSON.parse(useAuth?.user)?.firstName }}
                    </div>
                    <span class="q-mb-md q-mb-xs">{{
                      JSON.parse(useAuth?.user)?.emailAddress
                    }}</span>

                    <q-btn
                      color="primary"
                      label="Logout"
                      @click="logout"
                      push
                      size="sm"
                      v-close-popup
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      :mini="miniState"
      show-if-above
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      :width="300"
      bordered
      :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'"
    >
      <q-list class="q-gutter-y-md q-mt-xl">
        <q-item
          to="/dashboard"
          active-class="bg-primary text-white text-bold"
          clickable
          v-ripple
          style="border-radius: 0 30px 30px 0"
        >
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>

          <q-item-section> Dashboard </q-item-section>
        </q-item>

        <q-item
          active-class="bg-primary text-white text-bold"
          to="/vendors"
          clickable
          v-ripple
          style="border-radius: 0 30px 30px 0"
        >
          <q-item-section avatar>
            <q-icon name="storefront" />
          </q-item-section>

          <q-item-section> Vendors </q-item-section>
        </q-item>

        <q-item
          active-class="bg-primary text-white text-bold"
          to="/invoice"
          clickable
          v-ripple
          style="border-radius: 0 30px 30px 0"
        >
          <q-item-section avatar>
            <q-icon name="receipt_long" />
          </q-item-section>

          <q-item-section> Invoices </q-item-section>
        </q-item>

        <q-item
          active-class="bg-primary text-white text-bold"
          to="/payment"
          clickable
          v-ripple
          style="border-radius: 0 30px 30px 0"
        >
          <q-item-section avatar>
            <q-icon name="payments" />
          </q-item-section>

          <q-item-section> Payments </q-item-section>
        </q-item>

        <q-item
          active-class="bg-primary text-white text-bold"
          to="/accounting"
          clickable
          v-ripple
          style="border-radius: 0 30px 30px 0"
        >
          <q-item-section avatar>
            <q-icon name="account_balance" />
          </q-item-section>

          <q-item-section> Accounting </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <q-page-container
      class="absolute full-width"
      style="height: 100vh; overflow: hidden; overflow-y: scroll"
    >
      <!-- <q-page>

      </q-page> -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/useAuthStore";
import { useQuasar, setCssVar } from "quasar";

export default defineComponent({
  name: "MainLayout",

  setup() {
    const router = useRouter();
    const useAuth = useAuthStore();

    const $q = useQuasar();
    const toggleLeftDrawer = ref(false);
    const drawer = ref(false);
    const isDark = ref(false);
    const profilePopup = ref(true);

    const miniState = ref(true);

    function logout() {
      useAuth.logout();
    }

    watch(isDark, (currentValue, oldValue) => {
      if (currentValue) {
        localStorage.setItem("_is_dark_theme", true);
      } else {
        localStorage.setItem("_is_dark_theme", false);
      }
      checkTheme();
    });

    async function checkTheme() {
      const isDarkTheme = localStorage.getItem("_is_dark_theme");

      if (isDarkTheme == "true") {
        //dark theme
        $q.dark.set(true);

        isDark.value = true;
        setCssVar("primary", "#0066FF");
        setCssVar("secondary", "#131927");
      } else {
        // light theme
        $q.dark.set(false);
        isDark.value = false;
        setCssVar("primary", "#0066FF");
        setCssVar("secondary", "#C2DAFF");
      }
    }

    onMounted(() => {
      checkTheme();
    });

    return {
      toggleLeftDrawer,
      logout,
      miniState,
      drawer,
      isDark,
      profilePopup,
      useAuth,
      checkTheme,
    };
  },
});
</script>
