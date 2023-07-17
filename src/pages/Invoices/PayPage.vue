<template>
  <div
    class="scroll row justify-center wrap bg-secondary"
    style="height: calc(100vh - 80px)"
  >
    <!-- main -->
    <div
      class="q-ma-md bg-white"
      style="
        max-width: 50vw;
        width: 100%;
        min-width: 600px;
        border-radius: 10px;
      "
    >
      <q-list class="text2">
        <q-expansion-item
          default-opened
          icon="looks_one"
          label="Party Details"
          header-class="text-red text-h6"
          class="q-ma-md"
        >
          <q-card>
            <q-card-section>
              <div>
                <!-- vendor -->
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

                <q-separator />

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

                <q-separator />

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
                        @click="getInvoiceFile(invoiceDetail.invoiceId)"
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
          default-opened
          icon="looks_two"
          class="q-ma-md"
          label="Invoice Items"
          header-class="text-green text-h6"
        >
          <q-card class="q-ma-none">
            <q-card-section>
              <!-- columns -->
              <q-item class="row justify-between text3">
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

              <q-separator />
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

        <!-- 3rd card -->
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
              <div v-if="accountDetail.upiDetails.length != 0">
                <div class="q-ma-sm">
                  <q-radio
                    v-model="bankTypeSelect"
                    val="upi"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    label="Upi"
                    class="text-bold"
                    @update:model-value="
                      selectedPaymentDetails.paymentMethod = ''
                    "
                  />
                  <div v-if="bankTypeSelect == 'upi'" class="q-pa-sm">
                    <q-item
                      tag="label"
                      v-ripple
                      v-for="data in accountDetail.upiDetails"
                      :key="data"
                      @click="selectPaymentMethod(data)"
                    >
                      <q-item-section avatar top>
                        <q-radio
                          v-model="selectedPaymentDetails.paymentMethod"
                          :val="data.paymentMethodId"
                        />
                      </q-item-section>
                      <q-item-section avatar>
                        <q-item-label class="text-bold">
                          UPI ID :
                        </q-item-label>
                      </q-item-section>

                      <!-- name -->
                      <q-item-section class="">
                        <q-item-label class="text-bold">
                          {{ data.upiPayment?.upiAddress }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>

                    <!-- <q-item
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
                       avator
                      <q-item-section avatar>
                        <q-item-label class="text-bold">
                          UPI Details
                        </q-item-label>
                      </q-item-section>

                       name
                      <q-item-section class="">
                        <q-item-label class="text-bold">
                          {{ data.upiPayment?.upiAddress }}
                        </q-item-label>
                      </q-item-section>
                    </q-item> -->
                  </div>
                </div>
              </div>

              <q-separator size="2px" />

              <!-- bank -->
              <div v-if="accountDetail.bankDetails.length != 0">
                <div class="q-ma-sm">
                  <q-radio
                    v-model="bankTypeSelect"
                    val="bank"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    label="Bank"
                    class="text-bold"
                    @update:model-value="
                      selectedPaymentDetails.paymentMethod = ''
                    "
                  />

                  <div v-if="bankTypeSelect == 'bank'" class="q-pa-sm">
                    <q-item
                      v-for="data in accountDetail.bankDetails"
                      :key="data"
                      active-class="text-bold text-h6"
                      clickable
                      v-ripple
                      class="q-ma-md"
                      style="border-radius: 5px"
                      @click="selectPaymentMethod(data)"
                    >
                      <!-- avator -->
                      <q-item-section avatar>
                        <q-radio
                          v-model="selectedPaymentDetails.paymentMethod"
                          :val="data.paymentMethodId"
                        />
                      </q-item-section>

                      <!-- name -->
                      <q-item-section class="q-pa-sm q-gutter-y-md">
                        <q-item-label class="text-bold">
                          Account Holder Name : {{ data.companyNameOnAccount }}
                        </q-item-label>
                        <q-item-label class="text-bold">
                          Account Number : {{ data.accountNumber }}
                        </q-item-label>
                        <q-item-label class="text-bold">
                          IFSC Code : {{ data.routingNumber }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>

                    <!-- payment mode -->
                    <div class="q-pa-md colum">
                      <div class="q-pa-md q-gutter-y-md">
                        <div class="text-bold">Payment Mode:</div>
                        <div class="">
                          <q-select
                            dense
                            outlined
                            style="width: 300px"
                            v-model="selectedPaymentDetails.paymentMode"
                            @update:model-value="
                              (val) =>
                                (selectedPaymentDetails.paymentMode = val)
                            "
                            :options="['NEFT', 'RTGS', 'IMPS']"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- no account found -->
              <div
                v-if="
                  accountDetail.upiDetails.length == 0 &&
                  accountDetail.bankDetails.length == 0
                "
                class="row justify-center"
              >
                <div class="text-h6 q-ma-md full-width row justify-center">
                  Add Bank or Upi Accounts to make payment
                </div>
                <q-btn
                  dense
                  outline
                  rounded
                  class="q-pa-md"
                  color="primary"
                  label="Add Payment method"
                  @click="vendoPage(invoiceDetail.fromParty?.partyId)"
                />
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
                        @update:model-value="() => (amount.currentAmount = 0)"
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

              <!-- preview box -->
              <q-dialog v-model="showPreviewandValidateDialog" persistent>
                <div class="bg-white text-h6" style="border-radius: 20px">
                  <q-card style="width: 500px">
                    <q-card-section>
                      <div class="q-ma-md text-center text-primary">
                        Confirm payment
                      </div>

                      <div class="q-ma-md q-gutter-y-md">
                        <q-separator />
                        <div
                          class="row no-wrap justify-between"
                          v-if="amount.currentAmount == 0"
                        >
                          <div>Full Amount :</div>
                          <div class="text-right">
                            $ {{ amount.actualAmount }}
                          </div>
                        </div>

                        <div v-else class="row no-wrap justify-between">
                          <div>Partial Amount:</div>
                          <div class="text-right">
                            $ {{ amount.currentAmount }}
                          </div>
                        </div>

                        <!-- <div class="row no-wrap justify-between">
                          <div>currently paying amount :</div>
                          <div class="text-right">
                            {{ amount.currentAmount }}
                          </div>
                        </div> -->

                        <q-separator />
                        <div>
                          <div class="text2">Leave a Command:</div>
                          <q-input v-model="commands" outlined type="text" />
                        </div>
                      </div>

                      <!-- <div class="q-ma-md">
                        <div>
                          payment method :
                          {{ selectedPaymentDetails.paymentMethod }}
                        </div>
                        <div>
                          payment mode :
                          {{ selectedPaymentDetails.paymentMode }}
                        </div>
                      </div> -->
                    </q-card-section>

                    <q-card-actions class="row justify-evenly q-pa-md">
                      <q-btn
                        label="cancel"
                        rounded
                        outline
                        color="primary"
                        v-close-popup
                      />
                      <q-btn
                        label="Pay"
                        :loading="paymentLoading"
                        style="width: 68px"
                        rounded
                        color="primary"
                        @click="submitPayment"
                      />
                    </q-card-actions>
                  </q-card>
                </div>
              </q-dialog>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
    </div>

    <!-- side box -->
    <div class="q-pa-md" style="min-width: 400px">
      <q-card class="q-pa-md text2" style="border-radius: 10px">
        <div class="q-pa-md text-h6">Amount Details:</div>
        <q-separator />
        <div class="row justify-between q-pa-md">
          <div>Invoice amount</div>
          <div class="text2">$ {{ invoiceDetail.invoiceTotal }}</div>
        </div>
        <div class="row justify-between q-pa-md">
          <div>Paid amount</div>
          <div class="text2">
            $ {{ invoiceDetail.invoiceTotal - invoiceDetail.unpaidTotal }}
          </div>
        </div>
        <div class="row justify-between q-pa-md">
          <div>UnPaid amount</div>
          <div class="text2">$ {{ invoiceDetail.unpaidTotal }}</div>
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
import { computed, onMounted, ref, registerRuntimeCompiler } from "vue";
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
    const commands = ref("");

    const showPreviewandValidateDialog = ref(false);

    const paymentLoading = ref(false);
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
    }

    function getAccountDetails(id) {
      api({
        method: "GET",
        url: "paymentMethods/bankAccountInfoList",
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
      console.log(id);
      selectedPaymentDetails.value.paymentMethod = id;
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
      paymentLoading.value = true;
      const params = {};

      params["invoiceId"] = route.params.invoiceId;

      if (isPayFullAmount.value == "full") {
        params["amount"] = amount.value.actualAmount;
      } else {
        params["amount"] = amount.value.currentAmount;
      }

      params["comments"] = commands.value;
      params["effectiveDate"] = "2023-06-22";

      if (bankTypeSelect.value == "bank") {
        params["paymentMode"] = selectedPaymentDetails.value.paymentMode;
        params["paymentMethodId"] = selectedPaymentDetails.value.paymentMethod;
      } else {
        params["paymentMethodId"] = selectedPaymentDetails.value.paymentMethod;
      }

      // if (isPayFullAmount.value == "full") {
      //   console.log("fullamt");
      // } else {
      //   console.log("notfull");
      // }

      console.log(params);
      api({
        method: "POST",
        url: "payments/invoicePayment",
        headers: useAuth.authKey,
        params: params,
      })
        .then((res) => {
          console.log(res);
          paymentLoading.value = false;
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
          paymentLoading.value = false;
          console.log(err);
        });
    }

    function getInvoiceFile(id) {
      api({
        method: "GET",
        headers: useAuth.authKey,
        url: "invoices/viewUploadInvoice",
        params: {
          invoiceId: id,
        },
      }).then((res) => {
        window.open(res.data.uploadedInvoiceLink, "_blank");
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
      getInvoiceFile,

      selectedPaymentDetails,
      selectPaymentMethod,

      // dialog
      showPreviewandValidateDialog,
      showPreviewandValidate,
      submitPayment,
      commands,
      paymentLoading,
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
