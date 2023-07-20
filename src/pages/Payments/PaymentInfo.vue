<template>
  <div class="row no-wrap">
    <!-- sidelist -->
    <div style="width: 400px" v-if="!$q.screen.lt.md" class="fixed">
      <div class="q-pa-md q-gutter-y-md">
        <!-- search and date -->
        <div class="row no-wrap">
          <q-select
            dense
            outlined
            rounded
            class="q-pr-md full-width"
            clearable
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            v-model="searchInput"
          >
          </q-select>

          <!-- date filter -->
          <q-btn color="primary" icon="filter_alt" rounded> </q-btn>
        </div>

        <!-- tabs -->
        <div>
          <q-tabs
            v-model="currentTab"
            class="q-mx-md q-pa-sm"
            active-class="text-white bg-primary"
            indicator-color="transparent"
            no-caps
            dense
            style="border-radius: 12px; border: 1px solid silver"
            @update:model-value="getPaymentList()"
          >
            <q-tab
              v-for="data in enumTabList"
              :key="data"
              :label="data.description"
              :name="data.enumId"
              style="border-radius: 20px"
            />
          </q-tabs>
        </div>

        <!-- scroll area -->
        <div
          class="scroll"
          style="
            border-radius: 10px;
            height: calc(100vh - 210px);
            border: 1px solid #858585;
          "
        >
          <q-list class="q-gutter-sm q-pa-sm">
            <div
              v-if="paymentList.length == 0"
              class="row justify-center q-pa-lg text-bold text-h6 text-primary"
            >
              No data
            </div>

            <q-item
              v-for="data in paymentList"
              :key="data"
              clickable
              v-ripple
              class="bg-secondary"
              style="border-radius: 5px; width: auto; height: 96px"
              @click="getPaymentInfo(data.paymentDetail.paymentId)"
              :active="
                paymentDetails.paymentId === data.paymentDetail.paymentId
                  ? true
                  : false
              "
            >
              <!-- avator -->

              <q-item-section>
                <q-item-label style="font-size: 18px">
                  Payment ID: {{ data.paymentDetail.paymentId }}
                </q-item-label>
                <q-item-label style="font-size: 16px">
                  {{ truncateText(data.toParty.organizationName, 25) }}
                </q-item-label>
                <q-item-label style="font-size: 14px">
                  {{ truncateText(data.toParty.emailAddress, 23) }}
                </q-item-label>
              </q-item-section>

              <q-item-section avatar>
                <q-item-label class="text-bold text3">
                  $ {{ data.paymentDetail.amount }}
                </q-item-label>
                <q-item-label>
                  {{ dateModifer(data.paymentDetail.effectiveDate) }}
                </q-item-label>
                <q-item-label>
                  <q-badge>
                    {{
                      usePayment.paymentStatusProp.find(
                        (res) => res.statusId == data.paymentDetail.statusId
                      ).description
                    }}
                  </q-badge>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </div>
    <div style="width: 400px" v-if="!$q.screen.lt.md"></div>

    <!-- main -->
    <div class="full-width scroll">
      <!-- title bar -->
      <div class="row justify-center q-px-xl full-width">
        <div style="width: 600px">
          <div
            class="bg-secondary text-center q-pa-sm q-gutter-y-sm"
            style="border-radius: 0 0 70px 70px"
          >
            <div class="text-primary text1 q-mt-md">
              {{ paymentDetails.paymentId }}
            </div>
            <div class="">
              {{ paymentDetails.toParty?.organization.organizationName }}
            </div>

            <!-- cancel btn -->
            <div class="row absolute" style="top: 50px; right: 70px">
              <div
                class="bg-secondary"
                style="border-radius: 0 0 70px 70px; height: 50px"
              >
                <q-btn size="15px" icon="close" color="primary" flat />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- center body -->
      <div class="row justify-center text3">
        <div style="width: 800px" class="full-height">
          <!-- items -->

          <!-- body 1-->
          <div
            class="row justify-center q-my-md q-pa-lg bg-secondary"
            style="border-radius: 20px"
          >
            <!-- status -->
            <div class="full-width q-py-md">
              <q-item>
                <q-item-section>
                  <q-item-label>Payment Status:</q-item-label>
                </q-item-section>

                <q-item-section avatar>
                  <q-item-label>
                    <q-badge class="text-h6">
                      {{
                        usePayment.paymentStatusProp.find(
                          (res) => res.statusId == paymentDetails.statusId
                        )?.description
                      }}
                    </q-badge>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>

            <!-- vendor -->
            <div class="full-width q-py-md">
              <q-item>
                <q-item-section>
                  <q-item-label overline>From Party Name:</q-item-label>
                  <q-item-label>
                    {{
                      paymentDetails.fromParty?.organization.organizationName
                    }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>

            <!-- organization -->
            <div class="full-width q-py-md">
              <q-item>
                <q-item-section>
                  <q-item-label overline>To Party Name:</q-item-label>
                  <q-item-label>
                    {{ paymentDetails.toParty?.organization.organizationName }}
                  </q-item-label>
                </q-item-section>

                <q-item-section avatar>
                  <q-btn
                    @click="vendoPage(paymentDetails.toParty?.partyId)"
                    outline
                    rounded
                    color="primary"
                    label="View Vendor"
                  />
                </q-item-section>
              </q-item>
            </div>

            <!-- view invoice -->
            <div class="full-width q-py-sm">
              <q-item>
                <q-item-section>
                  <q-item-label overline>View Invoice:</q-item-label>
                  <q-item-label>
                    {{ paymentDetails.forInvoiceId }}
                  </q-item-label>
                </q-item-section>

                <q-item-section avatar>
                  <q-btn
                    @click="invoicePage(paymentDetails.forInvoiceId)"
                    outline
                    rounded
                    color="primary"
                    label="View Invoice"
                  />
                </q-item-section>
              </q-item>
            </div>
          </div>

          <!-- body 2-->
          <div
            class="row justify-center q-my-md q-pa-lg bg-secondary"
            style="border-radius: 20px"
          >
            <!--  amt -->
            <div class="full-width q-py-md">
              <q-item>
                <q-item-section>
                  <q-item-label>Paid Amount:</q-item-label>
                </q-item-section>

                <q-item-section avatar>
                  <q-item-label> ${{ paymentDetails.amount }} </q-item-label>
                </q-item-section>
              </q-item>
            </div>

            <!-- Currency -->
            <div class="full-width q-py-md">
              <q-item>
                <q-item-section>
                  <q-item-label>Currency:</q-item-label>
                </q-item-section>

                <q-item-section avatar>
                  <q-item-label>
                    {{ paymentDetails.amountUomId }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>

            <!-- utr -->
            <div class="full-width q-py-md">
              <q-item>
                <q-item-section>
                  <q-item-label>UTR Number:</q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <q-item-label>
                    {{ paymentDetails.method?.externalId }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>

            <!--method  -->
            <div class="full-width q-py-sm">
              <q-item>
                <q-item-section>
                  <q-item-label>Payment method:</q-item-label>
                </q-item-section>

                <q-item-section avatar>
                  <q-item-label>
                    {{ paymentDetails.method?.description }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>

            <div
              class="full-width q-py-sm"
              v-if="paymentDetails.method?.paymentMethodTypeEnumId == 'PmtUPI'"
            >
              <q-item>
                <q-item-section>
                  <q-item-label>UPI ID:</q-item-label>
                </q-item-section>

                <q-item-section avatar>
                  <q-item-label>
                    {{ paymentDetails.method?.upiPayment.upiAddress }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>

            <div class="full-width q-py-sm" v-else>
              <q-item>
                <q-item-section>
                  <q-item-label>Account Name:</q-item-label>
                </q-item-section>

                <q-item-section avatar>
                  <q-item-label>
                    {{ paymentDetails.method?.companyNameOnAccount }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>

            <div class="full-width q-py-sm">
              <q-item>
                <q-item-section>
                  <q-item-label>Comments:</q-item-label>
                </q-item-section>

                <q-item-section avatar>
                  <q-item-label>
                    {{ paymentDetails.comments }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </div>

          <!--payment history -->
          <div class="bg-secondary q-pa-lg q-mb-md" style="border-radius: 13px">
            <div class="text-h5 q-pa-md" style="text-decoration: underline">
              Payment History:
            </div>
            <q-item
              class="q-my-sm"
              v-for="data in paymentDetails.applications"
              :key="data"
            >
              <q-item-section>
                <q-item-label>
                  {{ data.paymentApplicationId }}
                </q-item-label>
                <q-item-label overline>
                  {{ data.appliedDate }}
                </q-item-label>
              </q-item-section>

              <q-item-section avatar>
                <q-item-label class="text-h6 text-green">
                  <q-badge class="text-body1">
                    {{ data.amountApplied }}
                  </q-badge>
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <!--payment history -->
          <div class="bg-secondary q-pa-lg q-mb-md" style="border-radius: 13px">
            <div class="text-h5 q-pa-md" style="text-decoration: underline">
              Accounting History(pending):
            </div>
            <q-item
              class="q-my-sm"
              v-for="data in paymentDetails.applications"
              :key="data"
            >
              <q-item-section>
                <q-item-label>
                  {{ data.paymentApplicationId }}
                </q-item-label>
                <q-item-label overline>
                  {{ data.appliedDate }}
                </q-item-label>
              </q-item-section>

              <q-item-section avatar>
                <q-item-label class="text-h6 text-green">
                  <q-badge class="text-body1">
                    {{ data.amountApplied }}
                  </q-badge>
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <!-- transections -->
          <!-- <div
            v-if="invoiceDetail?.paymentApplications"
            class="bg-secondary q-pa-lg q-ma-sm"
            style="border-radius: 13px"
          >
            <div class="text-h5 q-pa-md" style="text-decoration: underline">
              Payment History:
            </div>
            <q-item
              class="q-my-sm q-pa-md"
              v-for="data in invoiceDetail.paymentApplications"
              :key="data"
              clickable
              @click="paymentPage(data.paymentId)"
            >
              <q-item-section>
                <q-item-label> Payment ID: {{ data.paymentId }} </q-item-label>
                <q-item-label overline>
                  Applied date :
                  {{ formateTimeStamp(data.appliedDate).formattedTimestamp }}
                </q-item-label>
              </q-item-section>

              <q-item-section avatar>
                <q-item-label>
                  <q-badge color="green"> $ {{ data.amountApplied }} </q-badge>
                </q-item-label>
              </q-item-section>
            </q-item>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/stores/useAuthStore";
import { usePaymentStore } from "src/stores/usePaymentStore";

export default {
  name: "paymentInfo_page",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const useAuth = useAuthStore();
    const usePayment = usePaymentStore();

    const paymentList = ref([]);
    const paymentDetails = ref({});

    const currentTab = ref("allPayment");
    const enumTabList = ref([]);

    // side list
    const searchInput = ref("");

    // getaccounting list
    function getPaymentList() {
      paymentList.value = [];
      const params = {};

      params["pageSize"] = 40;
      params["pageIndex"] = 0;

      params["dateFilterId"] = currentTab.value;
      api({
        method: "GET",
        headers: useAuth.authKey,
        url: "payments",
        params: params,
      })
        .then((res) => {
          paymentList.value.push(...res.data.paymentInfoList);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    function getPaymentInfo(id) {
      api({
        method: "GET",
        headers: useAuth.authKey,
        url: `payments/${id}`,
      })
        .then((res) => {
          console.log(res);
          paymentDetails.value = res.data;
          console.log(paymentDetails.value);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    function getTabEnumList() {
      api({
        method: "GET",
        url: "enumeration",
        headers: useAuth.authKey,
        params: {
          enumTypeId: "UIPaymentStatus",
        },
      }).then(async (res) => {
        res.data.enumerationList.map((data) => {
          enumTabList.value.push(data);
        });
      });
    }

    // date formater 22 jun 2023
    const dateModifer = (val) => {
      if (val == undefined) {
        console.log("date not valid");
        return "";
      } else {
        const date = new Date(val);
        const options = { year: "numeric", month: "short", day: "2-digit" };
        const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
          date
        );
        return formattedDate; // outputs "06 JUN, 2013"
      }
    };

    const formateTimeStamp = (timeStamp) => {
      const date = new Date(timeStamp);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");

      const formattedTimestamp = `${day}-${month}-${year}`;

      const time = `${hours - 12}:${minutes} ${
        hours >= 12 && hours < 0 ? "AM" : "PM"
      }`;
      return { formattedTimestamp, time };
    };

    function truncateText(text, num) {
      if (typeof text !== "string") {
        throw new Error("Input must be a string.");
      }

      if (text.length <= num) {
        return text;
      } else {
        return text.substring(0, num) + "...";
      }
    }

    function vendoPage(id) {
      router.push({
        name: "vendorInfo_page",
        params: {
          vendorId: id,
        },
      });
    }

    function invoicePage(id) {
      router.push({
        name: "invoiceInfo_page",
        params: {
          invoiceId: id,
        },
      });
    }

    onMounted(() => {
      getPaymentInfo(route.params.paymentId);
      getTabEnumList();
      getPaymentList();
    });

    return {
      formateTimeStamp,
      dateModifer,
      getPaymentInfo,
      paymentDetails,

      vendoPage,
      invoicePage,
      currentTab,
      getPaymentList,
      enumTabList,
      usePayment,

      // sidelist
      searchInput,
      paymentList,
      truncateText,
    };
  },
};
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  display: none;
}
</style>
