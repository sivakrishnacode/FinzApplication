<template>
  <div class="row no-wrap">
    <!-- Side list -->
    <div
      class="q-gutter-y-sm q-pa-lg"
      style="width: 450px"
      v-if="!$q.screen.lt.md"
    >
      <!-- Search bar -->

      <q-input
        rounded
        outlined
        label="Search"
        dense
        @update:model-value="searchVendor(val)"
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
        @click="(addVendor_dialogBox = true), addCountryList()"
        no-wrap
        style="height: 20px"
      />

      <q-scroll-area
        class="q-pa-sm"
        style="border: 1px solid gray; border-radius: 10px; height: 650px"
      >
        <!-- List -->
        <q-list class="q-gutter-sm">
          <q-item
            v-for="data in rows"
            :key="data"
            @click="vendorInfo(data.partyId), (tab = 'userDetails')"
            :active="$route.params.vendorId === data.partyId ? true : false"
            active-class="text-bold text-h6"
            clickable
            v-ripple
            class="bg-secondary text-primary"
            style="border-radius: 5px"
          >
            <!-- avator -->
            <q-item-section avatar>
              <q-avatar text-color="yellow">
                <q-icon name="star" />
              </q-avatar>
            </q-item-section>

            <!-- name -->
            <q-item-section>
              <q-item-label>
                {{ data.organizationName }}
              </q-item-label>
              <q-item-label class="text-white text-caption" caption>
                {{ data.contactMechs[0].infoString }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <!-- Add vendor Dialog Box -->
      <q-dialog v-model="addVendor_dialogBox">
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
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                      val
                    ) || 'Please enter a valid email address',
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
                :disable="isCountryValid"
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
                :rules="[
                  (val) => (val && val.length > 0) || 'Enter a Postalcode',
                ]"
              ></q-input>

              <div class="row justify-evenly q-py-md">
                <q-btn rounded label="Cancel" color="red" v-close-popup></q-btn>
                <q-btn
                  rounded
                  label="Submit"
                  color="primary"
                  type="submit"
                ></q-btn>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
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
          <div class="text-blue-grey-1">
            {{ vendorInfoData.emailAddress }}
          </div>
        </div>
      </div>

      <!-- Nav bar btn -->
      <div class="full-width">
        <q-tabs no-caps content-class="row justify-evenly">
          <q-btn
            label="Invoices"
            to="/invoice"
            icon="receipt_long"
            class="bg-primary text-white q-pa-md"
            style="border-radius: 30px; width: 160px"
            no-caps
            flat
          />
          <q-btn
            label="Payments"
            to="/payment"
            icon="payments"
            class="bg-primary text-white q-pa-md"
            style="border-radius: 30px; width: 160px"
            no-caps
            flat
          />

          <q-btn
            label="Accounting"
            to="/accounting"
            icon="account_balance"
            class="bg-primary text-white q-pa-md"
            style="border-radius: 30px; width: 160px"
            no-caps
            flat
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

      <div class="row justify-center">
        <!-- Two panels -->
        <q-tab-panels v-model="tab">
          <!-- profile Details -->
          <q-tab-panel name="userDetails">
            <div class="q-pa-md bg-secondary" style="border-radius: 20px">
              <!-- title -->
              <div class="text-primary text-bold row justify-center full-width">
                Profile Details
              </div>

              <q-separator spaced />

              <div class="row q-gutter-y-lg">
                <!-- first row -->
                <div class="row full-width items-center justify-center">
                  <div class="col-5 q-gutter-x-xl">
                    <div class="text-primary" style="font-size: 19px">
                      <q-input
                        input-class="text-h6 text-primary"
                        :filled="!isVendorEditable"
                        :readonly="isVendorEditable"
                        label="Vendor Name"
                        borderless
                        v-model="vendorInfoData.organizationName"
                      />
                    </div>
                  </div>

                  <div class="col-5 q-gutter-x-xl">
                    <div class="text-primary" style="font-size: 19px">
                      <q-input
                        input-class="text-h6 text-primary"
                        :filled="!isVendorEditable"
                        :readonly="isVendorEditable"
                        label="Email ID"
                        borderless
                        v-model="vendorInfoData.emailAddress"
                      />
                    </div>
                  </div>
                </div>

                <!-- second row -->
                <div class="row full-width items-center justify-center">
                  <div class="col-5 q-gutter-x-xl">
                    <div class="text-primary" style="font-size: 19px">
                      <q-input
                        input-class="text-h6 text-primary"
                        :filled="!isVendorEditable"
                        :readonly="isVendorEditable"
                        label="Contact Number"
                        borderless
                        v-model="vendorInfoData.contactNumber"
                      />
                    </div>
                  </div>

                  <div class="col-5 q-gutter-x-xl">
                    <div class="text-primary" style="font-size: 19px">
                      <q-input
                        input-class="text-h6 text-primary"
                        :filled="!isVendorEditable"
                        :readonly="isVendorEditable"
                        label="Address 1"
                        borderless
                        v-model="vendorInfoData.address1"
                      />
                    </div>
                  </div>
                </div>

                <!-- third row -->
                <div class="row full-width items-center justify-center">
                  <div class="col-5 q-gutter-x-xl">
                    <div class="text-primary" style="font-size: 19px">
                      <q-input
                        input-class="text-h6 text-primary"
                        :filled="!isVendorEditable"
                        :readonly="isVendorEditable"
                        label="Address 2"
                        borderless
                        v-model="vendorInfoData.address2"
                      />
                    </div>
                  </div>

                  <div class="col-5 q-gutter-x-xl">
                    <div class="text-primary" style="font-size: 19px">
                      <q-input
                        input-class="text-h6 text-primary"
                        :filled="!isVendorEditable"
                        :readonly="isVendorEditable"
                        label="City"
                        borderless
                        v-model="vendorInfoData.city"
                      />
                    </div>
                  </div>
                </div>

                <!-- 4 row -->
                <div class="row full-width items-center justify-center">
                  <div class="col-5 q-gutter-x-xl">
                    <div class="text-primary" style="font-size: 19px">
                      <q-select
                        v-model="vendorInfoData.countryGeoId"
                        :filled="!isVendorEditable"
                        :readonly="isVendorEditable"
                        borderless
                        type="text"
                        label="Country"
                        option-label="geoName"
                        option-value="geoId"
                        @update:model-value="
                          getStateList(vendorInfoData.countryGeoId.geoId)
                        "
                        :options="countryList"
                      ></q-select>
                    </div>
                  </div>

                  <div class="col-5 q-gutter-x-xl">
                    <div class="text-primary" style="font-size: 19px">
                      <q-select
                        :filled="!isVendorEditable"
                        :readonly="isVendorEditable"
                        borderless
                        option-label="geoName"
                        option-value="geoId"
                        type="text"
                        label="State"
                        :options="stateList"
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
                    <div class="text-primary" style="font-size: 19px">
                      <q-input
                        input-class="text-h6 text-primary"
                        :filled="!isVendorEditable"
                        :readonly="isVendorEditable"
                        label="Pincode"
                        borderless
                        v-model="vendorInfoData.postalCode"
                      />
                    </div>
                  </div>

                  <div class="col-5 q-gutter-x-xl"></div>
                </div>
              </div>

              <div class="row justify-end q-gutter-x-sm">
                <q-btn
                  v-if="!isVendorEditable"
                  icon="save"
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
              class="row justify-center full-width q-gutter-x-lg"
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

            <!-- Active accounts details -->
            <div
              v-for="data in vendorsActiveBankDetails"
              :key="data.paymentMethodId"
            >
              <!--Active bank -->

              <q-item-section
                v-if="data.paymentMethodTypeEnumId === 'PmtBankAccount'"
                class="bg-secondary q-pa-lg"
                style="border-radius: 12px; width: 280px; height: 300px"
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
                  <q-badge color="positive" label="Active" />
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
                class="bg-secondary q-pa-lg"
                style="border-radius: 12px; width: 280px; height: 300px"
              >
                <span class="q-gutter-md">
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
import { api } from "src/boot/axios";

export default {
  name: "vendorInfo_page",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const useAuth = useAuthStore();
    const $q = useQuasar();

    const isShowActiveBankAccount = ref(false);
    const isBankAccountDetailsEmpty = ref(false);

    // table
    const rows = ref([]);
    const columns = ref([]);

    //new vendor info

    const addVendor_dialogBox = ref(false);
    const addBank_dialogBox = ref(false);
    const step = ref(1);
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
      router.push({ name: "vendorInfo_page", params: { vendorId: id } });
      api({
        method: "GET",
        url: `vendors/${id}/contactInfo`,
        headers: useAuth.authKey,
      })
        .then((res) => {
          console.log(res.data);
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
        countryGeoId: vendorInfoData.value.countryGeoId.geoId,
        stateProvinceGeoId: vendorInfoData.value.stateName.geoId,
        postalCode: vendorInfoData.value.postalCode,
      };

      api({
        method: "PATCH",
        url: "vendors/vendorContactInfo",
        headers: useAuth.authKey,
        params: params,
      }).then((res) => {
        console.log(res);
      });
    }

    // Search vendor
    function searchVendor(val) {
      if (val === "") {
        rows.value = [];

        vendorInfo(route.params.vendorId);
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
          console.log(res.data);

          // res.data.documentList.map((data) => {
          //   rows.value.push({
          //     organizationName: data.organizationName,
          //     emailAddress: data.contactMechs[0].infoString
          //       ? data.contactMechs[0].infoString
          //       : "",
          //     partyId: data.partyId,
          //   });
          // });
        });
      }
    }

    // Add bank account
    function addBankAccount(id) {
      console.log(id);
      let tempUrl = "";
      let data = {};
      if (addBankAccountTab.value == "bank") {
        tempUrl = "PaymentMethods/addBankAccount";
        data = {
          partyId: id,
          companyName: newBankAccountDetails.value.companyName,
          accountNo: newBankAccountDetails.value.accountNo,
          ifscCode: newBankAccountDetails.value.ifscCode,
        };
      } else {
        tempUrl = "PaymentMethods/addUPIAccount";
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
          url: "PaymentMethods/bankAccountInfoList",
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
        tempUrl = "PaymentMethods/fundAccountDeactivate";
      } else if (status == "false") {
        tempUrl = "PaymentMethods/fundAccountActivate";
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

    // add vendor
    function addVendor() {
      addVendor_dialogBox.value = false;
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
          countryGeoId: newVendorDetails.value.countryGeoId.geoId,
          stateProvinceGeoId: newVendorDetails.value.stateProvinceGeoId.geoId,
          postalCode: newVendorDetails.value.postalCode,
        },
      })
        .then((res) => {
          addVendor_dialogBox.value = false;
          newVendorDetails.value = {};
          rows.value = [];
          getVendorList();
          $q.notify({
            position: "top-right",
            message: "Vendor added succesfully",
            type: "positive",
            icon: "done",
          });
        })
        .catch((err) => {
          addVendor_dialogBox.value = false;
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
      // editInput.value.stateName = "";
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
      addCountryList();

      // remove this and change tab = userDatils
      bankAccountDetails("userDatils");
    });

    return {
      rows,
      columns,
      vendorInfo,
      addVendor_dialogBox,
      addBank_dialogBox,
      step,
      tab,
      vendorInfoData,
      editVendor,
      isVendorEditable,
      searchVendor,
      bankAccountDetails,
      vendorsActiveBankDetails,
      vendorsInActiveBankDetails,
      bankAccountStatus,
      addVendor,
      newVendorDetails,
      addCountryList,
      countryList,
      getStateList,
      isCountryValid,
      stateList,
      isShowActiveBankAccount,
      addBankAccount,
      newBankAccountDetails,
      addBankAccountTab,
      isBankAccountDetailsEmpty,
    };
  },
};
</script>
