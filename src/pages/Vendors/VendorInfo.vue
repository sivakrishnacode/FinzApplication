<template>
  <div class="row no-wrap">
    <!-- left Side list -->
    <div
      class="q-gutter-y-sm q-pa-lg"
      style="width: 550px"
      v-if="!$q.screen.lt.md"
    >
      <!-- Search bar -->

      <q-input
        rounded
        outlined
        label="Search"
        dense
        @update:model-value="(val) => searchVendor(val)"
      >
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>

      <!-- add vendor btn -->
      <q-btn
        rounded
        class="full-width"
        color="primary"
        label="Create Vendors"
        no-caps
        icon="add"
        @click="$router.push({ name: 'createVendor_page' })"
        no-wrap
        style="height: 20px"
      />
      <!-- @click="(addVendor_dialogBox = true), addCountryList()" -->

      <q-scroll-area
        class="q-pa-sm"
        style="border: 1px solid gray; border-radius: 10px; height: 75vh"
      >
        <!-- List -->
        <q-list class="q-gutter-sm">
          <q-item
            v-for="data in rows"
            :key="data"
            @click="vendorInfo(data.partyId), (tab = 'userDetails')"
            :active="$route.params.vendorId === data.partyId ? true : false"
            active-class="text-bold bg-active"
            clickable
            v-ripple
            class="bg-inActive"
            style="border-radius: 8px; height: 80px; width: auto"
          >
            <!-- avator -->
            <q-item-section avatar>
              <q-avatar class="bg-primary text-white" size="lg">
                <div>
                  {{ firstLetters(data.organizationName).toUpperCase() }}
                </div>
              </q-avatar>
            </q-item-section>

            <!-- name -->
            <q-item-section>
              <q-item-label style="font-size: 18px">
                {{ data.organizationName }}
              </q-item-label>

              <q-item-label class="text-caption" caption>
                {{
                  data.contactMechs.find(
                    (val) => val.contactMechTypeEnumId == "CmtEmailAddress"
                  ).infoString
                }}
                <!-- .substring(0, 30) + "..." -->
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </div>

    <!-- Vendor Info side -->
    <div class="row justify-center full-width full-height q-gutter-y-md">
      <!-- title -->
      <div class="row justify-center full-width">
        <div
          class="bg-secondary text-center"
          style="border-radius: 0 0 70px 70px; height: 80px; width: 600px"
        >
          <div class="q-mt-md text-primary text-h6">
            {{ vendorInfoData.organizationName }}
          </div>
          <div style="color: #858585">
            {{ vendorInfoData.emailAddress }}
          </div>
        </div>

        <!--  -->
        <div class="row absolute" style="right: 50px">
          <div
            class="bg-secondary"
            style="border-radius: 0 0 70px 70px; height: 50px"
          >
            <q-btn
              size="15px"
              icon="close"
              color="primary"
              flat
              @click="router.back()"
            />
          </div>
        </div>
      </div>

      <!-- Nav bar btn -->
      <div class="full-width">
        <q-tabs no-caps content-class="row ">
          <q-btn
            label="Invoices"
            icon="receipt_long"
            class="bg-primary text-white text-bold q-pa-md"
            style="
              border-radius: 50px;
              width: 216px;
              height: 58px;
              font-size: 18px;
            "
            no-caps
            flat
            @click="
              router.push({
                name: 'invoiceList_page',
                query: {
                  vendorName: vendorInfoData.organizationName,
                  partyId: vendorInfoData.partyId,
                },
              })
            "
          />
          <q-btn
            label="Payments"
            icon="payments"
            class="bg-primary text-white text-bold q-pa-md"
            style="
              border-radius: 50px;
              width: 216px;
              height: 58px;
              font-size: 18px;
              margin-left: 24px;
              margin-right: 24px;
            "
            no-caps
            flat
            @click="
              router.push({
                name: 'paymentList_page',
                query: {
                  vendorName: vendorInfoData.organizationName,
                  partyId: vendorInfoData.partyId,
                },
              })
            "
          />

          <q-btn
            label="Accounting"
            icon="account_balance"
            class="bg-primary text-white text-bold q-pa-md"
            style="
              border-radius: 50px;
              width: 216px;
              font-size: 18px;
              height: 58px;
            "
            no-caps
            flat
            @click="
              router.push({
                name: 'accountingList_page',
                query: {
                  vendorName: vendorInfoData.organizationName,
                  partyId: vendorInfoData.partyId,
                },
              })
            "
          />
        </q-tabs>
      </div>

      <!-- vendo info body -->
      <div class="row justify-center full-width">
        <q-tabs
          v-model="tab"
          dense
          class="text-black q-pa-sm"
          active-color=" bg-secondary text-primary"
          indicator-color="transparent"
          style="
            border: 2px solid silver;
            border-radius: 50px;
            width: 45%;
            height: 70px;
          "
          @update:model-value="(val) => bankAccountDetails(val)"
        >
          <q-tab
            name="userDetails"
            label="Profile"
            style="width: 100%; border-radius: 50px"
          />
          <q-tab
            name="accountDetails"
            label="Payments A/C"
            style="width: 100%; border-radius: 50px"
          />
        </q-tabs>
      </div>

      <!-- tab panels -->
      <div class="row justify-center">
        <!-- Two panels -->
        <q-tab-panels v-model="tab">
          <!-- profile Details -->
          <q-tab-panel name="userDetails">
            <div
              class="full-width row justify-center q-pa-md bg-secondary"
              style="border-radius: 20px; max-width: 1000px"
            >
              <!-- title -->
              <div class="text-primary text-bold row justify-center full-width">
                Profile Details
              </div>

              <q-separator spaced />

              <div class="row q-gutter-y-lg">
                <!-- first row -->
                <div class="row full-width items-center justify-center">
                  <div class="col-5 q-gutter-x-xl">
                    <div style="font-size: 19px">
                      <q-input
                        input-class="text-h6 "
                        :filled="!isVendorEditable"
                        :readonly="isVendorEditable"
                        label="Vendor Name"
                        label-color="dark"
                        borderless
                        v-model="vendorInfoData.organizationName"
                      />
                    </div>
                  </div>

                  <div class="col-5 q-gutter-x-xl">
                    <div style="font-size: 19px">
                      <q-input
                        input-class="text-h6 "
                        :filled="!isVendorEditable"
                        :readonly="isVendorEditable"
                        label="Email ID"
                        label-color="dark"
                        borderless
                        v-model="vendorInfoData.emailAddress"
                      />
                    </div>
                  </div>
                </div>

                <!-- second row -->
                <div class="row full-width items-center justify-center">
                  <div class="col-5 q-gutter-x-xl">
                    <div style="font-size: 19px">
                      <q-input
                        input-class="text-h6 "
                        :filled="!isVendorEditable"
                        :readonly="isVendorEditable"
                        label="Contact Number"
                        label-color="dark"
                        borderless
                        v-model="vendorInfoData.contactNumber"
                      />
                    </div>
                  </div>

                  <div class="col-5 q-gutter-x-xl">
                    <div style="font-size: 19px">
                      <q-input
                        input-class="text-h6 "
                        :filled="!isVendorEditable"
                        :readonly="isVendorEditable"
                        label="Address 1"
                        label-color="dark"
                        borderless
                        v-model="vendorInfoData.address1"
                      />
                    </div>
                  </div>
                </div>

                <!-- third row -->
                <div class="row full-width items-center justify-center">
                  <div class="col-5 q-gutter-x-xl">
                    <div style="font-size: 19px">
                      <q-input
                        input-class="text-h6 "
                        :filled="!isVendorEditable"
                        :readonly="isVendorEditable"
                        label="Address 2"
                        label-color="dark"
                        borderless
                        v-model="vendorInfoData.address2"
                      />
                    </div>
                  </div>

                  <div class="col-5 q-gutter-x-xl">
                    <div style="font-size: 19px">
                      <q-input
                        input-class="text-h6 "
                        :filled="!isVendorEditable"
                        :readonly="isVendorEditable"
                        label="City"
                        label-color="dark"
                        borderless
                        v-model="vendorInfoData.city"
                      />
                    </div>
                  </div>
                </div>

                <!-- 4 row -->
                <div class="row full-width items-center justify-center">
                  <div class="col-5 q-gutter-x-xl">
                    <div style="font-size: 19px">
                      <q-select
                        v-model="vendorInfoData.countryGeoId"
                        :filled="!isVendorEditable"
                        :readonly="isVendorEditable"
                        borderless
                        type="text"
                        label="Country"
                        label-color="dark"
                        @update:model-value="
                          useGeos.getStateList(
                            vendorInfoData.countryGeoId.geoId
                          )
                        "
                        :options="useGeos.countryList"
                        option-label="geoName"
                        option-value="geoId"
                      ></q-select>
                    </div>
                  </div>

                  <div class="col-5 q-gutter-x-xl">
                    <div style="font-size: 19px">
                      <q-select
                        :filled="!isVendorEditable"
                        :readonly="isVendorEditable"
                        borderless
                        option-label="geoName"
                        option-value="geoId"
                        label-color="dark"
                        type="text"
                        label="State"
                        :options="useGeos.stateList"
                        v-model="vendorInfoData.stateName"
                      ></q-select>
                      <!-- <q-input
                        input-class="text-h6 text-primary"
                        :filled="!isVendorEditable"
                        :readonly="isVendorEditable"
                        label="State"
                        borderless
                        v-model="vendorInfoData.stateName"
                      /> -->
                    </div>
                  </div>
                </div>

                <!-- 5th row -->
                <div class="row full-width items-center justify-center">
                  <div class="col-5 q-gutter-x-xl">
                    <div style="font-size: 19px">
                      <q-input
                        input-class="text-h6 "
                        :filled="!isVendorEditable"
                        :readonly="isVendorEditable"
                        label="Pincode"
                        label-color="dark"
                        borderless
                        v-model="vendorInfoData.postalCode"
                      />
                    </div>
                  </div>

                  <div class="col-5 q-gutter-x-xl"></div>
                </div>
              </div>

              <div class="row justify-end q-gutter-x-sm full-width">
                <q-btn
                  v-if="!isVendorEditable"
                  label="Save Changes"
                  size="15px"
                  flat
                  class="text-white bg-primary"
                  rounded
                  @click="(isVendorEditable = true), editVendor()"
                />
                <q-btn
                  v-if="!isVendorEditable"
                  label="Cancel"
                  size="15px"
                  class="text-primary"
                  flat
                  outlined
                  @click="isVendorEditable = true"
                />
                <q-btn
                  v-if="isVendorEditable"
                  icon="edit"
                  label="Edit Profile"
                  size="15px"
                  flat
                  class="text-white bg-primary"
                  rounded
                  @click="isVendorEditable = false"
                />
              </div>
            </div>
          </q-tab-panel>

          <!-- bank details -->
          <q-tab-panel
            name="accountDetails"
            class="bg-white row justify-evenly q-gutter-y-md"
          >
            <!-- Head -->
            <div
              class="row justify-center full-width q-gutter-x-lg q-ma-sm"
              v-if="!isBankAccountDetailsEmpty"
            >
              <q-toggle
                v-model="isShowActiveBankAccount"
                :label="
                  isShowActiveBankAccount
                    ? 'Hide In Active Accounts'
                    : 'Show In Active Accounts'
                "
              />

              <q-btn
                color="primary"
                icon="add"
                label="Add Bank Account"
                @click="addBank_dialogBox = !addBank_dialogBox"
              />
            </div>

            <!-- illustration -->
            <div v-if="isBankAccountDetailsEmpty">
              <div class="column items-center q-py-md">
                <q-img
                  height="400px"
                  width="400px"
                  src="https://img.freepik.com/free-vector/open-banking-data-access-financial-services-mobile-payment-app-development-api-technology-web-developers-designing-banking-platforms_335657-2401.jpg?w=740&t=st=1685427226~exp=1685427826~hmac=7be939d13a2f6ca1d0f4829e5124e2a31a74df973d4a41ba513fe0a299ac445d"
                />

                <q-btn
                  color="primary"
                  icon="add"
                  label="Add Bank Account"
                  rounded
                  @click="addBank_dialogBox = !addBank_dialogBox"
                />
              </div>
            </div>

            <!-- add bank account dailog box -->
            <q-dialog v-model="addBank_dialogBox">
              <q-card style="width: 600px; border-radius: 12px">
                <q-card-section>
                  <div
                    style="border-radius: 15px"
                    class="text-primary text-center text-bold q-pb-md"
                  >
                    Add Bank Account
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
                        @submit="addBankAccount(vendorInfoData.partyId)"
                        class="q-gutter-y-sm"
                      >
                        <q-input
                          label="Beneficiary UPI ID"
                          v-model="newBankAccountDetails.upiId"
                          :rules="[
                            (val) =>
                              (val && val.length > 0) ||
                              'Please Enter a UPI Id',
                          ]"
                        />
                        <div class="row justify-evenly q-py-md">
                          <q-btn
                            rounded
                            label="Cancel"
                            color="red"
                            v-close-popup
                            @click="newBankAccountDetails = {}"
                          ></q-btn>
                          <q-btn
                            rounded
                            label="Submit"
                            color="primary"
                            type="submit"
                          ></q-btn>
                        </div>
                      </q-form>
                    </q-tab-panel>

                    <!-- Bank -->
                    <q-tab-panel name="bank" class="q-gutter-y-md">
                      <q-form
                        @submit="addBankAccount(vendorInfoData.partyId)"
                        class="q-gutter-y-sm"
                      >
                        <q-input
                          dense
                          type="text"
                          label="Account Name"
                          v-model="newBankAccountDetails.companyName"
                          :rules="[
                            (val) =>
                              (val && val.length > 1) ||
                              'Please Enter a Account name',
                          ]"
                        />
                        <q-input
                          dense
                          label="Account No"
                          v-model="newBankAccountDetails.accountNo"
                          :rules="[
                            (val) =>
                              (val && val.length > 0) ||
                              'Please Enter a Account no',
                          ]"
                          type="password"
                        />
                        <q-input
                          dense
                          label="Re Enter Account No"
                          v-model="newBankAccountDetails.confirmAccountNo"
                          :rules="[
                            (val) =>
                              (val && val.length > 0) ||
                              'Please Re Enter a Account no',
                            (val) =>
                              (val &&
                                val === newBankAccountDetails.accountNo) ||
                              'Account No Does not match',
                          ]"
                          type="password"
                        />
                        <q-input
                          dense
                          label="IFSC Code"
                          type="text"
                          v-model="newBankAccountDetails.ifscCode"
                          :rules="[
                            (val) =>
                              (val && val.length > 0) ||
                              'Please Enter a IFSC code',
                          ]"
                        />
                        <div class="row justify-evenly q-py-md">
                          <q-btn
                            rounded
                            label="Cancel"
                            color="red"
                            v-close-popup
                            @click="newBankAccountDetails = {}"
                          ></q-btn>
                          <q-btn
                            rounded
                            label="Submit"
                            color="primary"
                            type="submit"
                          ></q-btn>
                        </div>
                      </q-form>
                    </q-tab-panel>
                  </q-tab-panels>
                </q-card-section>
              </q-card>
            </q-dialog>

            <!-- card sections .......................................... -->

            <!-- Active accounts details -->
            <div
              v-for="data in vendorsActiveBankDetails"
              :key="data.paymentMethodId"
            >
              <!--Active bank -->
              <q-item-section
                v-if="data.paymentMethodTypeEnumId === 'PmtBankAccount'"
                class="bg-secondary q-pa-lg q-ma-sm"
                style="border-radius: 12px; width: 280px; height: 300px"
              >
                <div class="row justify-between">
                  <div class="row q-gutter-x-md">
                    <q-icon
                      name="account_balance"
                      size="18px"
                      color="primary"
                    />
                    <q-item-label class="text-primary">
                      Bank Account
                    </q-item-label>
                  </div>
                  <q-badge color="positive" label="Active" />
                </div>

                <q-separator spaced />

                <div class="row justify-between">
                  <div class="col-5 q-my-auto">Beneficiary Name</div>
                  <div class="col-7 q-my-auto">
                    {{ data.companyNameOnAccount }}
                  </div>
                </div>

                <div class="row justify-between">
                  <div class="col-5 q-my-auto">Bank Name</div>
                  <div class="col-7 q-my-auto">{{ data.bankName }}</div>
                </div>

                <div class="row justify-between">
                  <div class="col-5 q-my-auto">Account No</div>
                  <div class="col-7 q-my-auto">{{ data.accountNumber }}</div>
                </div>

                <div class="row justify-between">
                  <div class="col-4 q-my-auto">IFSC Code</div>
                  <div class="col-7 q-my-auto">{{ data.routingNumber }}</div>
                </div>

                <div class="row justify-end q-mt-sm">
                  <q-btn
                    label="Make Inactive"
                    dense
                    flat
                    color="primary"
                    no-caps
                    @click="
                      bankAccountStatus(data.paymentMethodId, data.status)
                    "
                  />
                </div>
              </q-item-section>

              <!-- active upi -->
              <q-item-section
                v-else-if="data.paymentMethodTypeEnumId === 'PmtUPI'"
                class="bg-secondary q-pa-lg q-ma-sm"
                style="border-radius: 12px; width: 280px; height: 300px"
              >
                <span class="column justify-evenly q-gutter-md">
                  <div class="row justify-between">
                    <div class="row q-gutter-x-md">
                      <q-icon
                        name="currency_rupee"
                        size="18px"
                        color="primary"
                      />
                      <q-item-label class="text-primary"
                        >UPI Account</q-item-label
                      >
                    </div>
                    <q-badge color="positive" label="Active" />
                  </div>

                  <q-separator spaced />
                  <div class="row justify-between">
                    <div class="col-5 q-my-auto">Beneficiary Name</div>
                    <div class="col-7 q-my-auto">
                      {{ data.upiPayment.userName }}
                    </div>
                  </div>

                  <div class="row justify-between">
                    <div class="col-5 q-my-auto">UPI Id</div>
                    <div class="col-7 q-my-auto">
                      {{ data.upiPayment.upiAddress }}
                    </div>
                  </div>

                  <div class="row justify-between">
                    <div class="col-5 q-my-auto">UPI Bank</div>
                    <div class="col-7 q-my-auto">
                      {{ data.upiPayment.handle }}
                    </div>
                  </div>

                  <div class="row justify-end q-mt-sm">
                    <q-btn
                      label="Make Inactive"
                      dense
                      flat
                      color="primary"
                      no-caps
                      @click="
                        bankAccountStatus(data.paymentMethodId, data.status)
                      "
                    />
                  </div>
                </span>
              </q-item-section>
            </div>

            <!-- In active accounts Details -->
            <span v-if="isShowActiveBankAccount" class="row justify-start">
              <div
                v-for="data in vendorsInActiveBankDetails"
                :key="data.paymentMethodId"
              >
                <!-- InActive bank -->
                <q-item-section
                  v-if="data.paymentMethodTypeEnumId === 'PmtBankAccount'"
                  style="border-radius: 12px; width: 280px; height: 300px"
                  class="bg-secondary q-pa-lg"
                >
                  <div class="row justify-between">
                    <div class="row q-gutter-x-md">
                      <q-icon
                        name="account_balance"
                        size="18px"
                        color="primary"
                      />
                      <q-item-label class="text-primary"
                        >Bank Account</q-item-label
                      >
                    </div>
                    <q-badge color="red-9" label="InActive" />
                  </div>

                  <q-separator spaced />

                  <div class="row justify-between">
                    <div class="col-5 text-grey-12 q-my-auto">
                      Beneficiary Name
                    </div>
                    <div class="col-7 q-my-auto">
                      {{ data.companyNameOnAccount }}
                    </div>
                  </div>

                  <div class="row justify-between">
                    <div class="col-5 text-grey-12 q-my-auto">Bank Name</div>
                    <div class="col-7 q-my-auto">{{ data.bankName }}</div>
                  </div>

                  <div class="row justify-between">
                    <div class="col-5 text-grey-12 q-my-auto">Account No</div>
                    <div class="col-7 q-my-auto">{{ data.accountNumber }}</div>
                  </div>

                  <div class="row justify-between">
                    <div class="col-4 text-grey-12 q-my-auto">IFSC Code</div>
                    <div class="col-7 q-my-auto">{{ data.routingNumber }}</div>
                  </div>

                  <div class="row justify-end q-pt-sm">
                    <q-btn
                      label="Make Active"
                      dense
                      flat
                      color="primary"
                      no-caps
                      @click="
                        bankAccountStatus(data.paymentMethodId, data.status)
                      "
                    />
                  </div>
                </q-item-section>

                <!-- InActive upi -->
                <q-item-section
                  v-else-if="data.paymentMethodTypeEnumId === 'PmtUPI'"
                  style="border-radius: 12px; width: 280px; height: 300px"
                  class="bg-secondary q-pa-lg"
                >
                  <div class="row justify-between q-gutter-y-sm">
                    <div class="row q-gutter-x-md">
                      <q-icon
                        name="currency_rupee"
                        size="18px"
                        color="primary"
                      />
                      <q-item-label class="text-primary q-my-auto"
                        >UPI</q-item-label
                      >
                    </div>
                    <q-badge color="red-9" label="InActive" />
                  </div>

                  <q-separator spaced />

                  <div class="row justify-between">
                    <div class="col-5 text-grey-12 q-my-auto">
                      Beneficiary Name
                    </div>
                    <div class="col-7 q-my-auto">
                      {{ data.upiPayment.userName }}
                    </div>
                  </div>

                  <div class="row justify-between">
                    <div class="col-5 text-grey-12 q-my-auto">UPI Id</div>
                    <div class="col-7 q-my-auto">
                      {{ data.upiPayment.upiAddress }}
                    </div>
                  </div>

                  <div class="row justify-between">
                    <div class="col-5 text-grey-12 q-my-auto">UPI Bank</div>
                    <div class="col-7 q-my-auto">
                      {{ data.upiPayment.handle }}
                    </div>
                  </div>

                  <div class="row justify-end q-mt-sm">
                    <q-btn
                      label="Make active"
                      dense
                      flat
                      color="primary"
                      no-caps
                      @click="
                        bankAccountStatus(data.paymentMethodId, data.status)
                      "
                    />
                  </div>
                </q-item-section>
              </div>
            </span>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useAuthStore } from "src/stores/useAuthStore";
import { useGeosStore } from "src/stores/UseGeosStore";

import { api } from "src/boot/axios";

export default {
  name: "vendorInfo_page",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const useAuth = useAuthStore();
    const useGeos = useGeosStore();

    const $q = useQuasar();

    const isShowActiveBankAccount = ref(false);
    const isBankAccountDetailsEmpty = ref(false);

    // table
    const rows = ref([]);
    const columns = ref([]);

    //new vendor info

    const addVendor_dialogBox = ref(false);
    const addBank_dialogBox = ref(false);

    const newVendorDetails = ref([]);
    const newBankAccountDetails = ref({});
    const countryList = ref([]);
    const stateList = ref([]);

    // vendor info
    const vendorInfoData = ref({
      partyId: "",
      organizationName: "",
      emailAddress: "",
      contactNumber: "",
      address1: "",
      address2: "",
      city: "",
      countryName: "",
      countryGeoId: "",
      stateName: "",
      stateProvinceGeoId: "",
      postalCode: "",
    });

    const isVendorEditable = ref(true);
    const vendorsActiveBankDetails = ref([]);
    const vendorsInActiveBankDetails = ref([]);

    const tab = ref("userDetails");
    const addBankAccountTab = ref("upi");

    // get vendor List
    function getVendorList() {
      api({
        method: "GET",
        url: "vendors",
        headers: useAuth.authKey,
        params: {
          pageNoLimit: true,
        },
      }).then((res) => {
        res.data.documentList.map((data) => {
          rows.value.push(data);
        });
      });
    }

    // get vendor info
    function vendorInfo(id) {
      router.replace({
        params: {
          vendorId: id,
        },
      });
      api({
        method: "GET",
        url: `vendors/${id}/contactInfo`,
        headers: useAuth.authKey,
      })
        .then((res) => {
          vendorInfoData.value = {
            partyId: res.data.partyId,
            organizationName: res.data.organizationName,
            emailAddress: res.data.emailAddress,
            contactNumber: res.data.contactNumber,
            address1: res.data.address.address1,
            address2: res.data.address?.address2,
            city: res.data.address.city,
            countryName: res.data.address.countryName,
            countryGeoId: res.data.address.countryGeoId,
            stateName: res.data.address.stateName,
            stateProvinceGeoId: res.data.address.stateProvinceGeoId,
            postalCode: res.data.address.postalCode,
          };
        })
        .catch((err) => {
          console.log(err);
        });
    }

    //first letter of a world
    function firstLetters(str) {
      let words = str.split(" ");
      let firstLetter1 = words[0].charAt(0).toUpperCase();
      let firstLetter2 = words.length > 1 ? words[1].charAt(0) : "";
      return firstLetter1 + firstLetter2;
    }

    // edit vendor
    function editVendor() {
      const params = {
        partyId: vendorInfoData.value.partyId,
        organizationName: vendorInfoData.value.organizationName,
        contactNumber: vendorInfoData.value.contactNumber,
        emailAddress: vendorInfoData.value.emailAddress,
        address1: vendorInfoData.value.address1,
        address2: vendorInfoData.value.address2,
        city: vendorInfoData.value.city,
        countryGeoId:
          vendorInfoData.value.countryGeoId.geoId ??
          vendorInfoData.value.countryGeoId,
        stateProvinceGeoId:
          vendorInfoData.value.stateName.geoId ??
          vendorInfoData.value.stateProvinceGeoId,
        postalCode: vendorInfoData.value.postalCode,
      };
      api({
        method: "PATCH",
        url: "vendors/vendorContactInfo",
        headers: useAuth.authKey,
        params: params,
      }).then((res) => {
        vendorInfo(res.data.partyId);
        $q.notify({
          message: "Vendor Edited Succesfully",
          position: "top-right",
          color: "green",
          type: "positive",
          icon: "done",
        });
      });
    }

    // Search vendor
    function searchVendor(val) {
      if (val === "") {
        rows.value = [];

        getVendorList();
      } else {
        rows.value = [];
        api({
          method: "GET",
          url: "vendors",
          params: {
            anyField: val,
          },
          headers: useAuth.authKey,
        }).then((res) => {
          rows.value.push(...res.data.documentList);
        });
      }
    }

    // Add bank account
    function addBankAccount(id) {
      console.log(id);
      let tempUrl = "";
      let data = {};
      if (addBankAccountTab.value == "bank") {
        tempUrl = "paymentMethods/addBankAccount";
        data = {
          partyId: id,
          companyName: newBankAccountDetails.value.companyName,
          accountNo: newBankAccountDetails.value.accountNo,
          ifscCode: newBankAccountDetails.value.ifscCode,
        };
      } else {
        tempUrl = "paymentMethods/addUPIAccount";
        data = {
          partyId: id,
          upiId: newBankAccountDetails.value.upiId,
        };
      }

      console.log(tempUrl);
      console.log(data);

      api({
        method: "POST",
        url: tempUrl,
        headers: useAuth.authKey,
        params: data,
      })
        .then((res) => {
          newBankAccountDetails.value = {};
          addBank_dialogBox.value = false;
          console.log(res);
          tab.value = "accountDetails";
          bankAccountDetails(tab.value);

          $q.notify({
            position: "top-right",
            message: "Account Saved Succesfully",
            type: "positive",
            icon: "done",
          });
        })
        .catch((err) => {
          $q.notify({
            position: "top-right",
            message: JSON.parse(err.response.data.errors.replace(/'/g, '"'))
              .errorMsg,
            type: "negative",
            icon: "cancel",
          });
        });
    }

    // Bank details
    function bankAccountDetails(id) {
      if (id == "accountDetails") {
        api({
          method: "GET",
          url: "paymentMethods/bankAccountInfoList",
          headers: useAuth.authKey,
          params: {
            partyId: route.params.vendorId,
          },
        }).then((res) => {
          vendorsActiveBankDetails.value = [];
          vendorsInActiveBankDetails.value = [];
          isBankAccountDetailsEmpty.value = false;

          if (res.data.methodInfoList.length == 0) {
            isBankAccountDetailsEmpty.value = true;
          }
          res.data.methodInfoList.map((data) => {
            if (data.status == "true") {
              vendorsActiveBankDetails.value.push(data);
            } else {
              vendorsInActiveBankDetails.value.push(data);
            }
          });
        });
      }
    }

    // Active-InActive Bank Account
    async function bankAccountStatus(id, status) {
      let tempUrl = "";
      if (status == "true") {
        tempUrl = "paymentMethods/fundAccountDeactivate";
      } else if (status == "false") {
        tempUrl = "paymentMethods/fundAccountActivate";
      }
      await api({
        method: "PATCH",
        url: tempUrl,
        headers: useAuth.authKey,
        params: {
          paymentMethodId: id,
        },
      }).then((res) => {
        console.log(res);
      });
      bankAccountDetails((id = "accountDetails"));
    }

    const isCountryValid = computed(() => {
      if (
        newVendorDetails.value.countryGeoId !== "" &&
        newVendorDetails.value.countryGeoId !== null
      ) {
        return false;
      } else {
        // eslint-disable-next-line
        newVendorDetails.value.stateProvinceGeoId = null;
        return true;
      }
    });

    onMounted(() => {
      getVendorList();
      vendorInfo(route.params.vendorId);

      // remove this and change tab = userDatils
      bankAccountDetails("userDatils");
    });

    return {
      rows,
      columns,
      vendorInfo,
      addVendor_dialogBox,
      addBank_dialogBox,
      router,
      tab,
      vendorInfoData,
      editVendor,
      isVendorEditable,
      searchVendor,
      bankAccountDetails,
      vendorsActiveBankDetails,
      vendorsInActiveBankDetails,
      bankAccountStatus,
      useGeos,

      newVendorDetails,
      firstLetters,

      isCountryValid,

      isShowActiveBankAccount,
      addBankAccount,
      newBankAccountDetails,
      addBankAccountTab,
      isBankAccountDetailsEmpty,
    };
  },
};
</script>
