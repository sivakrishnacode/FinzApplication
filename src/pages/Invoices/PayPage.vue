<template>
  <div class="row justify-center wrap bg-orange-2">
    <!-- main -->
    <div
      class="q-ma-md bg-white"
      style="max-width: 50vw; width: 100%; min-width: 600px"
    >
      <q-list bordered>
        <q-expansion-item
          icon="looks_one"
          label="Party Details"
          header-class="text-red text-h6"
          class="q-ma-md"
        >
          <q-card>
            <q-card-section>
              <div>
                <div class="full-width q-py-md">
                  <q-item>
                    <q-item-section>
                      <q-item-label overline>Vendor Name:</q-item-label>
                      <q-item-label>
                        {{
                          invoiceDetail.fromParty?.organization.organizationName
                        }}
                      </q-item-label>
                    </q-item-section>

                    <q-item-section avatar>
                      <q-btn
                        outline
                        rounded
                        color="primary"
                        label="View Vendor"
                        @click="vendoPage(invoiceDetail.fromParty?.partyId)"
                      />
                    </q-item-section>
                  </q-item>
                </div>

                <!-- organization -->
                <div class="full-width q-py-md">
                  <q-item>
                    <q-item-section>
                      <q-item-label overline>Organization Name:</q-item-label>
                      <q-item-label>
                        {{
                          invoiceDetail.toParty?.organization.organizationName
                        }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </div>

                <!-- view invoice -->
                <div class="full-width q-py-sm">
                  <q-item>
                    <q-item-section>
                      <q-item-label overline>View Invoice:</q-item-label>
                      <q-item-label>
                        {{ invoiceDetail.externalId }}
                      </q-item-label>
                    </q-item-section>

                    <q-item-section avatar>
                      <q-btn
                        outline
                        rounded
                        color="primary"
                        label="View Invoice"
                      />
                    </q-item-section>
                  </q-item>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-separator />

        <q-expansion-item
          icon="looks_two"
          class="q-ma-md"
          label="Invoice Items"
          header-class="text-green text-h6"
        >
          <q-card class="q-ma-none">
            <q-card-section>
              <!-- columns -->
              <q-item class="row justify-between">
                <q-item-section class="col-1 text-weight-bold">
                  S.NO
                </q-item-section>
                <q-item-section class="col-3 text-weight-bold">
                  Product Name
                </q-item-section>
                <q-item-section class="col-3 text-weight-bold">
                  Unit price
                </q-item-section>
                <q-item-section
                  class="col-2 text-weight-bold row content-center"
                >
                  Quantity
                </q-item-section>
                <q-item-section
                  class="col-2 text-weight-bold row content-center"
                >
                  Price
                </q-item-section>
              </q-item>

              <!-- rows -->
              <q-item
                class="row justify-between"
                v-for="(data, index) in invoiceDetail.items"
                :key="index"
              >
                <q-item-section class="col-1 text-weight-bold">
                  {{ index + 1 }}
                </q-item-section>
                <q-item-section class="col-3 text-weight-bold">
                  {{ data.description }}
                </q-item-section>
                <q-item-section class="col-3 text-weight-bold">
                  {{ data.amount }}
                </q-item-section>
                <q-item-section
                  class="col-2 text-weight-bold row content-center"
                >
                  {{ data.quantity }}
                </q-item-section>
                <q-item-section
                  class="col-2 text-weight-bold row content-center"
                >
                  {{ data.amount * data.quantity }}
                </q-item-section>
              </q-item>
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-separator />

        <q-expansion-item
          default-opened
          class="q-ma-md"
          icon="looks_3"
          label="Payment Method"
          header-class="text-blue text-h6"
        >
          <q-card>
            <!-- banks options -->
            <q-card-section class="">
              <!-- upi -->
              <div class="q-ma-sm">
                <q-radio
                  v-model="bankTypeSelect"
                  val="upi"
                  checked-icon="task_alt"
                  unchecked-icon="panorama_fish_eye"
                  label="Upi"
                  class="text-bold"
                />
                <div v-if="bankTypeSelect == 'upi'" class="q-pa-sm">
                  <q-item
                    v-for="data in accountDetail.upiDetails"
                    :key="data"
                    active-class="text-bold text-h6"
                    clickable
                    v-ripple
                    class="bg-secondary text-primary q-ma-md"
                    style="border-radius: 5px"
                    @click="selectPaymentMethod(data)"
                    :active="
                      selectedPaymentDetails.paymentMethod ==
                      data.paymentMethodId
                        ? true
                        : false
                    "
                  >
                    <!-- avator -->
                    <q-item-section avatar>
                      <q-item-label class="text-bold">
                        UPI Details
                      </q-item-label>
                    </q-item-section>

                    <!-- name -->
                    <q-item-section class="">
                      <q-item-label class="text-bold">
                        {{ data.upiPayment?.upiAddress }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
              </div>

              <q-separator size="2px" />

              <!-- bank -->
              <div class="q-ma-sm">
                <q-radio
                  v-model="bankTypeSelect"
                  val="bank"
                  checked-icon="task_alt"
                  unchecked-icon="panorama_fish_eye"
                  label="Bank"
                  class="text-bold"
                />

                <div v-if="bankTypeSelect == 'bank'" class="q-pa-sm">
                  <q-item
                    v-for="data in accountDetail.bankDetails"
                    :key="data"
                    active-class="text-bold text-h6"
                    clickable
                    v-ripple
                    class="bg-secondary text-primary q-ma-md"
                    style="border-radius: 5px"
                    @click="selectPaymentMethod(data)"
                    :active="
                      selectedPaymentDetails.paymentMethod ==
                      data.paymentMethodId
                        ? true
                        : false
                    "
                  >
                    <!-- avator -->
                    <q-item-section avatar>
                      <q-item-label class="text-bold">
                        ac holder name
                      </q-item-label>
                      <q-item-label class="text-bold"> ac no </q-item-label>
                      <q-item-label class="text-bold"> ifsc no </q-item-label>
                    </q-item-section>

                    <!-- name -->
                    <q-item-section class="">
                      <q-item-label class="text-bold">
                        {{ data.companyNameOnAccount }}
                      </q-item-label>
                      <q-item-label class="text-bold">
                        {{ data.accountNumber }}
                      </q-item-label>
                      <q-item-label class="text-bold">
                        {{ data.routingNumber }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>

                  <!-- payment mode -->
                  <div class="q-pa-md colum content-center justify-center">
                    <div class="q-pa-md q-gutter-y-md">
                      <div class="text-bold">Payment Mode:</div>
                      <div class="">
                        <q-select
                          dense
                          outlined
                          style="width: 300px"
                          v-model="selectedPaymentDetails.paymentMode"
                          @update:model-value="
                            (val) => (selectedPaymentDetails.paymentMode = val)
                          "
                          :options="['NEFT', 'RTGS', 'IMPS']"
                          label="Filled"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </q-card-section>

            <!-- edit amount -->
            <q-card-section style="border: 1px solid silver" class="">
              <!--amount  input -->
              <div class="row justify-center q-gutter-y-md">
                <!-- fullamount -->
                <div class="row justify-center full-width">
                  <q-item
                    tag="label"
                    v-ripple
                    style="width: 50%; border: 1px solid silver"
                  >
                    <q-item-section avatar>
                      <q-radio
                        v-model="isPayFullAmount"
                        val="full"
                        @update:model-value="() => (amount.currentAmount = '')"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label> $ {{ amount.actualAmount }} </q-item-label>
                      <q-item-label caption>Pay Full Amount</q-item-label>
                    </q-item-section>
                  </q-item>
                </div>

                <!-- partail amount -->
                <div class="row justify-center full-width">
                  <q-item
                    tag="label"
                    v-ripple
                    style="width: 50%; border: 1px solid silver"
                  >
                    <q-item-section avatar>
                      <q-radio v-model="isPayFullAmount" val="!full" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label> Edit Amount </q-item-label>
                      <q-item-label caption>
                        Pay less then - {{ amount.actualAmount }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </div>

                <div
                  v-if="isPayFullAmount == '!full'"
                  class="q-ma-md"
                  style="width: 50%; border-radius: 30px"
                >
                  <q-input
                    rounded
                    outlined
                    v-model="amount.currentAmount"
                    type="number"
                    label="Amount"
                    :error="!isAmountValid"
                    :error-message="`Enter Less then ${amount.actualAmount}`"
                  />
                </div>
              </div>

              <!-- btns -->
              <div class="row justify-center q-gutter-x-md q-ma-md">
                <q-btn
                  :disable="
                    isAmountValid || selectedPaymentDetails.paymentMethod !== ''
                  "
                  rounded
                  label="Reset"
                  color="red"
                  @click="amount.currentAmount = null"
                ></q-btn>
                <q-btn
                  :disable="!isAmountValid"
                  rounded
                  label="Continue"
                  color="primary"
                  type="submit"
                  @click="showPreviewandValidate()"
                />
              </div>

              <q-dialog v-model="showPreviewandValidateDialog" persistent>
                <div class="bg-white text-h6">
                  <div class="q-ma-md">Confirm payment</div>
                  <q-separator />
                  <div class="q-ma-md">
                    <div>Actual amount : {{ amount.actualAmount }}</div>
                    <div>
                      already paid amount amount :
                      {{
                        invoiceDetail.invoiceTotal - invoiceDetail.unpaidTotal
                      }}
                    </div>
                    <div>
                      currently paying amount : {{ amount.currentAmount }}
                    </div>
                  </div>
                  <q-separator />
                  <div class="q-ma-md">
                    <div>
                      payment method :
                      {{ selectedPaymentDetails.paymentMethod }}
                    </div>
                    <div>
                      payment mode : {{ selectedPaymentDetails.paymentMode }}
                    </div>
                  </div>
                  <div class="row justify-evenly q-pa-md">
                    <q-btn label="cancel" color="secondary" v-close-popup />
                    <q-btn label="Pay" color="primary" @click="submitPayment" />
                  </div>
                </div>
              </q-dialog>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
    </div>

    <!-- side box -->
    <div class="q-pa-md" style="min-width: 400px">
      <q-card class="q-pa-md">
        <div class="q-pa-md text-h6">Amount Details:</div>
        <q-separator />
        <div class="row justify-between q-pa-md">
          <div>Invoice amount</div>
          <div>$ {{ invoiceDetail.invoiceTotal }}</div>
        </div>
        <div class="row justify-between q-pa-md">
          <div>Paid amount</div>
          <div>
            $ {{ invoiceDetail.invoiceTotal - invoiceDetail.unpaidTotal }}
          </div>
        </div>
        <div class="row justify-between q-pa-md">
          <div>UnPaid amount</div>
          <div>$ {{ invoiceDetail.unpaidTotal }}</div>
        </div>

        <q-separator />
        <div class="row justify-between q-pa-md">
          <div class="text-h6">Total amount</div>
          <div>$ {{ invoiceDetail.invoiceTotal }}</div>
        </div>
        <q-separator />
        <div class="q-pa-md text-green text-bold">
          Your Total Amount $4504 for 7 items in Invoice123.name
        </div>
      </q-card>

      <div>
        <q-item class="q-pa-lg">
          <q-item-section avatar>
            <q-icon name="verified_user" />
          </q-item-section>
          <q-item-section class="text-bold">
            Safe and Secure Payments. 100% Authentic products.
            <span class="text-blue text-underline">Refund Policy</span>
          </q-item-section>
        </q-item>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from "src/boot/axios";
import { useAuthStore } from "src/stores/useAuthStore";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuasar } from "quasar";
export default {
  name: "payment_page",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const useAuth = useAuthStore();
    const $q = useQuasar();

    // accordian section
    const bankTypeSelect = ref("upi");
    const isAmountEditable = ref(false);
    const amount = ref({
      actualAmount: 0,
      currentAmount: 0,
    });

    const showPreviewandValidateDialog = ref(false);

    const isPayFullAmount = ref("full");
    const selectedPaymentDetails = ref({
      paymentMethod: "",
      paymentMode: "NEFT",
    });

    const invoiceDetail = ref({});
    const accountDetail = ref({
      bankDetails: [],
      upiDetails: [],
    });

    async function getInvoiceDetails(invoiseId) {
      invoiceDetail.value = "";
      await api({
        method: "GET",
        url: `invoices/${invoiseId}`,
        headers: useAuth.authKey,
      }).then((res) => {
        invoiceDetail.value = res.data;
      });

      getAccountDetails(invoiceDetail.value.fromParty.partyId);

      amount.value.actualAmount =
        invoiceDetail.value.unpaidTotal ?? invoiceDetail.value.invoiceTotal;
      console.log(amount.value.actualAmount);
    }

    function getAccountDetails(id) {
      api({
        method: "GET",
        url: "PaymentMethods/bankAccountInfoList",
        headers: useAuth.authKey,
        params: {
          partyId: id,
        },
      }).then((res) => {
        res.data.methodInfoList.map((data) => {
          if (data.status == "true") {
            if (data.paymentMethodTypeEnumId == "PmtBankAccount") {
              accountDetail.value.bankDetails.push(data);
            } else {
              accountDetail.value.upiDetails.push(data);
            }
          }
        });
      });
    }

    function vendoPage(id) {
      router.push({
        name: "vendorInfo_page",
        params: {
          vendorId: id,
        },
      });
    }

    function selectPaymentMethod(id) {
      selectedPaymentDetails.value.paymentMethod = id.paymentMethodId;
    }

    function showPreviewandValidate() {
      if (selectedPaymentDetails.value.paymentMethod == "") {
        $q.notify({
          position: "top-right",
          message: "Select any Payment Method",
          type: "negative",
          icon: "cancel",
        });
      } else if (
        isPayFullAmount.value == "!full" &&
        amount.value.currentAmount == 0
      ) {
        $q.notify({
          position: "top-right",
          message: "Enter the amount or select full amount",
          type: "negative",
          icon: "cancel",
        });
      } else {
        showPreviewandValidateDialog.value = true;
      }
    }

    function submitPayment() {
      console.log("okk");
      const params = {};

      params["invoiceId"] = route.params.invoiceId;
      params["amount"] =
        amount.value.currentAmount !== 0
          ? amount.value.actualAmount
          : amount.value.currentAmount;

      params["comments"] = "demo command";
      params["effectiveDate"] = "2023-06-22";

      if (bankTypeSelect.value == "bank") {
        params["paymentMode"] = selectedPaymentDetails.value.paymentMode;
        params["paymentMethodId"] = selectedPaymentDetails.value.paymentMethod;
      } else {
        params["paymentMethodId"] = selectedPaymentDetails.value.paymentMethod;
      }

      console.log(params);
      api({
        method: "POST",
        url: "payments/invoicePayment",
        headers: useAuth.authKey,
        params: params,
      })
        .then((res) => {
          console.log(res);
          $q.notify({
            position: "top-right",
            message: `Succesfully payment sent - ${res.data.amount}`,
            type: "positive",
            icon: "done",
          });
          showPreviewandValidateDialog.value = false;
          router.push({
            name: "invoiceInfo_page",
            params: {
              invoiceId: route.params.invoiceId,
            },
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }

    const isAmountValid = computed(
      () => amount.value.actualAmount >= amount.value.currentAmount
    );

    onMounted(() => {
      getInvoiceDetails(route.params.invoiceId);
    });

    return {
      // accordian 3
      bankTypeSelect,
      isAmountValid,
      amount,
      isAmountEditable,
      invoiceDetail,
      vendoPage,
      accountDetail,
      isPayFullAmount,

      selectedPaymentDetails,
      selectPaymentMethod,

      // dialog
      showPreviewandValidateDialog,
      showPreviewandValidate,
      submitPayment,
    };
  },
};
</script>

<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
