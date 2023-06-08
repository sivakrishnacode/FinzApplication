<template>
  <div class="q-pa-xl row justify-center bg-blue-grey-1">
    <!--  -->
    <q-stepper
      v-model="step"
      ref="stepper"
      color="primary"
      animated
      keep-alive
      style="
        width: 900px;
        height: 700px;
        box-shadow: rgba(71, 67, 67, 0.56) 0px 22px 70px 4px;
        border-radius: 12px;
      "
    >
      <q-step :name="1" title="Create Vendor" icon="settings">
        <q-form @submit="addVendor" class="q-gutter-y-sm">
          <div
            class="text-primary text-center text-bold"
            style="font-size: 18px"
          >
            Create Vendor
          </div>
          <div class="row justify-center no-wrap">
            <q-input
              outlined
              type="text"
              label="Vendor Name"
              class="full-width q-pa-md"
              v-model="newVendorDetails.vendorName"
              :rules="[
                (val) => (val && val.length > 0) || 'First Name Required',
                (val) => (val && val.length > 2) || 'Enter minimun 2 letters',
              ]"
            ></q-input>
          </div>

          <div class="row justify-center no-wrap">
            <q-input
              outlined
              class="full-width q-pa-md"
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
              outlined
              class="full-width q-pa-md"
              type="text"
              label="Email"
              v-model="newVendorDetails.emailAddress"
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Please Enter a Email address',
                (val) =>
                  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                    val
                  ) || 'Please enter a valid email address',
              ]"
            ></q-input>
          </div>

          <div class="row justify-center no-wrap">
            <q-input
              outlined
              class="full-width q-pa-md"
              type="text"
              label="Adderss 1"
              v-model="newVendorDetails.address1"
              :rules="[
                (val) => (val && val.length > 3) || 'Please Enter Address',
              ]"
            ></q-input>
            <q-input
              outlined
              class="full-width q-pa-md"
              type="text"
              label="Address 2"
              v-model="newVendorDetails.address2"
              hint="optional"
              :rules="[]"
            ></q-input>
          </div>

          <div class="row justify-center no-wrap">
            <q-input
              outlined
              class="full-width q-pa-md"
              type="text"
              label="City"
              v-model="newVendorDetails.city"
              :rules="[(val) => (val && val.length > 2) || 'Enter a City']"
            ></q-input>
            <q-select
              v-model="newVendorDetails.countryGeoId"
              outlined
              class="full-width q-pa-md"
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
          </div>

          <div class="row justify-center no-wrap">
            <q-select
              :disable="!isCountryValid"
              outlined
              class="full-width q-pa-md"
              option-label="geoName"
              option-value="geoId"
              type="text"
              label="State"
              :options="stateList"
              v-model="newVendorDetails.stateProvinceGeoId"
              :rules="[(val) => val || 'Select the State']"
            ></q-select>
            <q-input
              outlined
              class="full-width q-pa-md"
              type="text"
              label="Postal Code"
              v-model="newVendorDetails.postalCode"
              :rules="[
                (val) => (val && val.length > 0) || 'Enter a Postalcode',
              ]"
            ></q-input>
          </div>

          <div class="row justify-evenly q-py-md">
            <q-btn
              rounded
              label="Cancel"
              color="red"
              @click="router.back()"
            ></q-btn>
            <q-btn rounded label="Continue" color="primary" type="submit" />
          </div>
        </q-form>
      </q-step>

      <q-step :name="2" title="Add Bank Account" icon="create_new_folder">
        <div class="q-gutter-y-md">
          <div
            class="column justify-center text-center text-primary text-bold text-h6"
          >
            Vendor Details
          </div>
          <q-tabs
            v-model="addBankAccountTab"
            class="row justify-center full-width text-black q-pa-sm"
            content-class="row justify-center "
            active-color=" bg-primary text-white"
            indicator-color="transparent"
            style="
              border: 2px solid silver;
              border-radius: 50px;

              height: 70px;
            "
          >
            <q-tab
              name="upi"
              label="UPI"
              style="width: 100%; border-radius: 50px"
            />
            <q-tab
              name="bank"
              label="Bank Account"
              style="width: 100%; border-radius: 50px"
            />
          </q-tabs>

          <q-tab-panels v-model="addBankAccountTab">
            <!-- UPI -->
            <q-tab-panel name="upi">
              <q-form
                @submit="addBankAccount(), (newBankAccountDetails.bank = '')"
                class="q-gutter-y-sm"
              >
                <q-input
                  label="Beneficiary UPI ID"
                  v-model="newBankAccountDetails.upi"
                  :rules="[
                    (val) => (val && val.length > 5) || 'Please Enter a UPI Id',
                  ]"
                />
                <div class="row justify-evenly q-py-md">
                  <q-btn
                    rounded
                    label="Back"
                    color="red"
                    v-close-popup
                    @click="step = 1"
                  ></q-btn>
                  <div v-if="isUpiFormValid">
                    <q-btn
                      rounded
                      label="Save & Continue"
                      color="primary"
                      type="submit"
                    ></q-btn>
                  </div>
                  <q-btn
                    v-else
                    rounded
                    label="Skip"
                    color="primary"
                    @click="skipBankDetails()"
                    type="submit"
                  ></q-btn>
                </div>
              </q-form>
            </q-tab-panel>

            <!-- Bank -->
            <q-tab-panel name="bank" class="q-gutter-y-md">
              <q-form
                @submit="addBankAccount(), (newBankAccountDetails.upi = '')"
                class="q-gutter-y-sm"
              >
                <q-input
                  dense
                  type="text"
                  label="Account Name"
                  v-model="newBankAccountDetails.bank.companyName"
                  :rules="[
                    (val) =>
                      (val && val.length > 1) || 'Please Enter a Account name',
                  ]"
                />
                <q-input
                  dense
                  label="Account No"
                  v-model="newBankAccountDetails.bank.accountNo"
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'Please Enter a Account no',
                  ]"
                  type="password"
                />
                <q-input
                  dense
                  label="Re Enter Account No"
                  v-model="newBankAccountDetails.bank.confirmAccountNo"
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'Please Re Enter a Account no',
                    (val) =>
                      (val && val === newBankAccountDetails.bank.accountNo) ||
                      'Account No Does not match',
                  ]"
                  type="password"
                />
                <q-input
                  dense
                  label="IFSC Code"
                  type="text"
                  v-model="newBankAccountDetails.bank.ifscCode"
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'Please Enter a IFSC code',
                  ]"
                />
                <div class="row justify-evenly q-py-md">
                  <q-btn
                    rounded
                    label="Back"
                    color="red"
                    v-close-popup
                    @click="step = 1"
                  ></q-btn>

                  <q-btn
                    v-if="isBankFormValid"
                    rounded
                    label="Save & Continue"
                    color="primary"
                    type="submit"
                  ></q-btn>

                  <q-btn
                    v-else
                    rounded
                    label="Skip"
                    color="primary"
                    @click="skipBankDetails()"
                  ></q-btn>
                </div>
              </q-form>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </q-step>

      <q-step :name="3" title="Preview Screen" icon="add_comment">
        <div class="q-gutter-y-lg">
          <!-- vendor details -->
          <div class="q-gutter-y-md">
            <div
              class="column justify-center text-center text-primary text-bold text-h6"
            >
              Vendor Details
            </div>

            <q-item class="row no-wrap">
              <q-item-section>
                <q-item-label overline>Vendor Name</q-item-label>
                <q-item-label>{{ newVendorDetails.vendorName }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label overline>Contact Number</q-item-label>
                <q-item-label>{{
                  newVendorDetails.contactNumber
                }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label overline>Email Address</q-item-label>
                <q-item-label>{{ newVendorDetails.emailAddress }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item class="row no-wrap">
              <q-item-section>
                <q-item-label overline>Address 1</q-item-label>
                <q-item-label>{{ newVendorDetails.address1 }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label overline>Address 2</q-item-label>
                <q-item-label>{{ newVendorDetails.address2 }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label overline>City</q-item-label>
                <q-item-label>{{ newVendorDetails.city }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item class="row no-wrap">
              <q-item-section>
                <q-item-label overline>Country</q-item-label>
                <q-item-label>{{ newVendorDetails.countryGeoId }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label overline>State</q-item-label>
                <q-item-label>{{
                  newVendorDetails.stateProvinceGeoId.geoName
                }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label overline>PostalCode</q-item-label>
                <q-item-label>{{ newVendorDetails.postalCode }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <q-separator spaced />
          <!-- bank details -->
          <div class="q-gutter-y-md">
            <div
              class="column justify-center text-center text-primary text-bold text-h6"
            >
              Bank Details
            </div>

            <q-item class="row no-wrap">
              <q-item-section>
                <q-item-label overline>Type</q-item-label>
                <q-item-label>Bank</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label overline>Account Name</q-item-label>
                <q-item-label>siva krishna</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label overline>Account Number</q-item-label>
                <q-item-label>1811120000016</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label overline>IFSC Code</q-item-label>
                <q-item-label>CNRB0001618</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <q-separator />

          <div v-if="false" class="row justify-center content-center q-mt-lg">
            <q-card style="width: 50%">
              <q-item clickable v-ripple>
                <q-item-section>Vendor Details</q-item-section>
                <q-item-section avatar>
                  <q-icon color="primary" name="bluetooth" />
                </q-item-section>
              </q-item>

              <q-item clickable v-ripple>
                <q-item-section>Bank Details</q-item-section>
                <q-item-section avatar>
                  <q-icon color="primary" name="bluetooth" />
                </q-item-section>
              </q-item>
            </q-card>
          </div>

          <div class="row justify-evenly">
            <q-btn
              rounded
              label="Back"
              color="red"
              v-close-popup
              @click="step = 2"
            ></q-btn>
            <q-btn rounded label="Submit" color="primary"></q-btn>
          </div>
        </div>
      </q-step>
    </q-stepper>

    <!-- stepper 3 -->
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

    const step = ref(3);
    const addBankAccountTab = ref("upi");

    const newBankAccountDetails = ref({
      upi: "",
      bank: {
        companyName: "",
        accountNo: "",
        confirmAccountNo: "",
        ifscCode: "",
      },
    });

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
      step.value = 2;
      // api({
      //   method: "POST",
      //   url: "vendors/vendor",
      //   headers: useAuth.authKey,
      //   data: {
      //     vendorName: newVendorDetails.value.vendorName,
      //     contactNumber: newVendorDetails.value.contactNumber,
      //     emailAddress: newVendorDetails.value.emailAddress,
      //     address1: newVendorDetails.value.address1,
      //     address2: newVendorDetails.value.address2,
      //     city: newVendorDetails.value.city,
      //     countryGeoId: newVendorDetails.value.countryGeoId,
      //     stateProvinceGeoId: newVendorDetails.value.stateProvinceGeoId.geoId,
      //     postalCode: newVendorDetails.value.postalCode,
      //   },
      // })
      //   .then((res) => {
      //     // router.back();
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
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

    function addBankAccount() {
      step.value = 3;
    }

    function skipBankDetails() {
      console.log(newVendorDetails.value);
      step.value = 3;
    }

    const isCountryValid = computed(() => {
      if (!!newVendorDetails.value.countryGeoId) {
        return true;
      } else {
        return false;
      }
    });

    const isUpiFormValid = computed(() => {
      console.log("upi");
      if (!!newBankAccountDetails.value.upi) {
        return true;
      } else {
        return false;
      }
    });

    const isBankFormValid = computed(() => {
      console.log("okkkkkkkkkk");
      if (
        !!newBankAccountDetails.value.bank.companyName ||
        !!newBankAccountDetails.value.bank.accountNo ||
        !!newBankAccountDetails.value.bank.confirmAccountNo ||
        !!newBankAccountDetails.value.bank.ifscCode
      ) {
        return true;
      } else {
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
      newBankAccountDetails,
      router,

      isUpiFormValid,
      isBankFormValid,

      // function
      addBankAccount,
      skipBankDetails,

      // stepper items
      step,
      addBankAccountTab,
    };
  },
};
</script>

<style></style>
