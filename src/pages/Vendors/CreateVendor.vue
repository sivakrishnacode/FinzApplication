<template>
  <div>
    <q-card style="width: 600px; border-radius: 12px">
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
            rules="[]"
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
            @update:model-value="
              getStateList(newVendorDetails.countryGeoId.geoId)
            "
            :options="countryList"
            :rules="[(val) => val || 'select  the country']"
          ></q-select>
          <q-select
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
    </q-card>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "createVendor_page",
  setup() {
    const newVendorDetails = ref("");
    function addVendor() {
      // dd
    }

    return {
      newVendorDetails,
      addVendor,
    };
  },
};
</script>

<style lang="scss" scoped></style>
