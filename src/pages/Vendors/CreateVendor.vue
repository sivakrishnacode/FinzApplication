<template>
  <div class="q-pa-xl">
    <q-stepper
      v-model="step"
      header-nav
      ref="stepper"
      color="primary"
      animated
      class="full-width"
    >
      <q-step :name="1" title="Select campaign settings" icon="settings">
        For each ad campaign that you create, you can control how much you're
        willing to spend on clicks and conversions, which networks and
        geographical locations you want your ads to show on, and more.

        <q-stepper-navigation>
          <q-btn
            @click="
              () => {
                step = 2;
              }
            "
            color="primary"
            label="Continue"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="2"
        title="Create an ad group"
        caption="Optional"
        icon="create_new_folder"
      >
        An ad group contains one or more ads which target a shared set of
        keywords.

        <q-stepper-navigation>
          <q-btn
            @click="
              () => {
                step = 3;
              }
            "
            color="primary"
            label="Continue"
          />
          <q-btn
            flat
            @click="step = 1"
            color="primary"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step :name="3" title="Create an ad" icon="add_comment">
        Try out different ad text to see what brings in the most customers, and
        learn how to enhance your ads using features like ad extensions. If you
        run into any problems with your ads, find out how to tell if they're
        running and how to resolve approval issues.

        <q-stepper-navigation>
          <q-btn color="primary" label="Finish" />
          <q-btn
            flat
            @click="step = 2"
            color="primary"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
    <div class="row justify-evenly content-center full-height">
      <q-card
        :style="{
          height: step == 1 ? '400px' : '300px',
          width: step == 1 ? '400px' : '300px',
        }"
        class="bg-green"
      >
        Create Vendor
      </q-card>
      <q-card
        :style="{
          height: step == 2 ? '400px' : '300px',
          width: step == 2 ? '400px' : '300px',
        }"
        class="bg-red"
      >
        Add bank Methods
      </q-card>
      <q-card
        :style="{
          height: step == 3 ? '400px' : '300px',
          width: step == 3 ? '400px' : '300px',
        }"
        class="bg-info"
      >
        Preview
      </q-card>
    </div>
  </div>
</template>

<script>
import { api } from "src/boot/axios";
import { useAuthStore } from "src/stores/useAuthStore";
import { ref, onMounted, computed } from "vue";

import { useRouter } from "vue-router";

export default {
  name: "createVendor_page",
  setup() {
    const useAuth = useAuthStore();
    const router = useRouter();
    const step = ref(1);
    const newVendorDetails = ref({
      vendorName: "",
      contactNumber: "",
      emailAddress: "",
      address1: "",
      address2: "",
      city: "",
      countryGeoId: "",
      stateProvinceGeoId: "",
      postalCode: "",
    });
    const countryList = ref([]);
    const stateList = ref([]);

    // add vendor
    function addVendor() {
      api({
        method: "POST",
        url: "vendors/vendor",
        headers: useAuth.authKey,
        data: {
          vendorName: newVendorDetails.value.vendorName,
          contactNumber: newVendorDetails.value.contactNumber,
          emailAddress: newVendorDetails.value.emailAddress,
          address1: newVendorDetails.value.address1,
          address2: newVendorDetails.value.address2,
          city: newVendorDetails.value.city,
          countryGeoId: newVendorDetails.value.countryGeoId,
          stateProvinceGeoId: newVendorDetails.value.stateProvinceGeoId.geoId,
          postalCode: newVendorDetails.value.postalCode,
        },
      })
        .then((res) => {
          router.back();
        })
        .catch((err) => {
          console.log(err);
        });
    }

    // add all countryList to vendor dialog box
    function addCountryList() {
      api({
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

    //add states to vendor dialog box
    function getStateList(geoId) {
      console.log(geoId);
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

    const isCountryValid = computed(() => {
      console.log("trigred");
      if (!!newVendorDetails.value.countryGeoId) {
        return true;
      } else {
        // eslint-disable-next-line

        return false;
      }
    });

    onMounted(() => {
      addCountryList();
    });

    return {
      newVendorDetails,
      addVendor,
      getStateList,
      countryList,
      stateList,
      isCountryValid,

      // stepper items
      step,
    };
  },
};
</script>

<style></style>

<!-- <q-card style="width: 600px; border-radius: 12px">
  <q-card-section>
    <q-form @submit="addVendor" class="q-gutter-y-sm">
      <div
        style="border-radius: 15px"
        class="text-primary text-center text-bold"
      >
        ADD VENDOR
      </div>
      <q-input
        dense
        type="text"
        label="Vendor Name"
        v-model="newVendorDetails.vendorName"
        :rules="[
          (val) => (val && val.length > 0) || 'First Name Required',
          (val) => (val && val.length > 2) || 'Enter minimun 2 letters',
        ]"
      ></q-input>
      <q-input
        dense
        class="contact_num_input"
        type="number"
        label="Contact Number"
        v-model="newVendorDetails.contactNumber"
        prefix="+91"
        :rules="[
          (val) => (val && val.length > 0) || 'Number Required',
          (val) => (val && val.length >= 10) || 'Enter Full number',
        ]"
      ></q-input>
      <q-input
        dense
        type="text"
        label="Email"
        v-model="newVendorDetails.emailAddress"
        :rules="[
          (val) =>
            (val && val.length > 0) || 'Please Enter a Email address',
          (val) =>
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val) ||
            'Please enter a valid email address',
        ]"
      ></q-input>
      <q-input
        dense
        type="text"
        label="Adderss 1"
        v-model="newVendorDetails.address1"
        :rules="[
          (val) => (val && val.length > 3) || 'Please Enter Address',
        ]"
      ></q-input>
      <q-input
        dense
        type="text"
        label="Address 2"
        v-model="newVendorDetails.address2"
        hint="optional"
        :rules="[]"
      ></q-input>
      <q-input
        dense
        type="text"
        label="City"
        v-model="newVendorDetails.city"
        :rules="[(val) => (val && val.length > 2) || 'Enter a City']"
      ></q-input>
      <q-select
        v-model="newVendorDetails.countryGeoId"
        dense
        type="text"
        label="Country"
        option-label="geoName"
        option-value="geoId"
        emit-value
        map-options
        @update:model-value="(val) => getStateList(val)"
        :options="countryList"
        :rules="[(val) => !!val || 'select  the country']"
      ></q-select>
      <q-select
        :disable="!isCountryValid"
        dense
        option-label="geoName"
        option-value="geoId"
        type="text"
        label="State"
        :options="stateList"
        v-model="newVendorDetails.stateProvinceGeoId"
        :rules="[(val) => val || 'Select the State']"
      ></q-select>
      <q-input
        dense
        type="text"
        label="Postal Code"
        v-model="newVendorDetails.postalCode"
        :rules="[(val) => (val && val.length > 0) || 'Enter a Postalcode']"
      ></q-input>

      <div class="row justify-evenly q-py-md">
        <q-btn rounded label="Cancel" color="red" v-close-popup></q-btn>
        <q-btn rounded label="Submit" color="primary" type="submit"></q-btn>
      </div>
    </q-form>
  </q-card-section>
</q-card> -->
