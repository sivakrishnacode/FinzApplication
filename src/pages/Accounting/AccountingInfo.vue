<template>
  <div class="row no-wrap">
    <!-- sidelist -->
    <div style="width: 400px" v-if="!$q.screen.lt.md">
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

        <!-- scroll area -->
        <div
          class="scroll q-pa-sm full-width"
          style="border-radius: 10px; height: 82vh; border: 1px solid #858585"
        >
          <q-list class="q-gutter-sm">
            <q-item
              v-for="data in accountingList"
              :key="data"
              clickable
              v-ripple
              class="bg-secondary"
              style="border-radius: 5px; height: 96px"
              @click="getAccountingInfo(data.transactionDetail.paymentId)"
              :active="
                data.transactionDetail.paymentId ==
                accountingDetails[0]?.paymentId
                  ? true
                  : false
              "
            >
              <!-- ssssssssssssssssssssssss -->
              <q-item-section>
                <q-item-label style="font-size: 18px">
                  Acc ID: {{ data.transactionDetail.acctgTransId }}
                </q-item-label>
                <q-item-label style="font-size: 16px">
                  {{ truncateText(data.otherParty.organizationName, 25) }}
                </q-item-label>
                <q-item-label style="font-size: 14px">
                  {{ truncateText(data.otherParty.emailAddress, 23) }}
                </q-item-label>
              </q-item-section>

              <q-item-section avatar>
                <q-item-label class="text-bold text3">
                  $ {{ data.transactionDetail.amount }}
                </q-item-label>
                <q-item-label>
                  {{ dateModifer(data.transactionDetail.transactionDate) }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </div>

    <!-- main -->
    <div class="col text2" v-if="accountingDetails[0]?.acctgTransId">
      <!-- title bar -->
      <div class="row justify-center q-px-xl full-width">
        <div style="width: 700px">
          <div
            class="bg-secondary text-center q-pa-sm q-gutter-y-sm"
            style="border-radius: 0 0 70px 70px"
          >
            <div class="text-h6 text-primary">
              Payment ID: {{ accountingDetails[0].paymentId }}
            </div>
            <div>
              {{
                formateTimeStamp(accountingDetails[0].postedDate)
                  .formattedTimestamp
              }}

              {{ formateTimeStamp(accountingDetails[0].postedDate).time }}
            </div>

            <!-- cancel btn -->
            <div class="row absolute" style="top: 50px; right: 70px">
              <div
                class="bg-secondary"
                style="border-radius: 0 0 70px 70px; height: 50px"
              >
                <q-btn
                  @click="router.back"
                  size="15px"
                  icon="close"
                  color="primary"
                  flat
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ids row -->
      <div class="row justify-center q-ma-md">
        <div
          class="row bg-secondary q-pa-md"
          style="width: 80%; border-radius: 15px"
        >
          <!-- 1 -->
          <div class="col-4">
            <q-item>
              <q-item-section>
                <q-item-label class="row justify-center">
                  Transection ID
                </q-item-label>
                <q-item-label class="row justify-center text-h6">
                  {{ accountingDetails[0].acctgTransId }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <!-- 2 -->
          <div class="col-4">
            <q-item>
              <q-item-section>
                <q-item-label class="row justify-center">
                  Payment ID
                </q-item-label>
                <q-item-label class="row justify-center text-h6">
                  {{ accountingDetails[0].paymentId }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <!-- 3 -->
          <div class="col-4">
            <q-item>
              <q-item-section>
                <q-item-label class="row justify-center">
                  Invoice ID
                </q-item-label>
                <q-item-label class="row justify-center text-h6">
                  {{ accountingDetails[2]?.invoiceId }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </div>
      </div>

      <!-- body -->
      <div class="row justify-center">
        <div
          class="bg-secondary row q-ma-md full-height"
          style="width: 80%; height: 68vh; border-radius: 20px"
        >
          <!-- left -->
          <div :class="!$q.screen.lt.lg ? 'col-4' : 'col-12'">
            <div
              class="column justify-evenly full-height q-pa-md"
              style="min-height: 350px"
            >
              <q-item class="full-width">
                <q-item-section>
                  <q-item-label caption>Organization:</q-item-label>
                  <q-item-label>
                    {{ accountingDetails[2]?.fromParty.organizationName }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item class="row wrap full-width">
                <q-item-section>
                  <q-item-label caption>Vendor:</q-item-label>
                  <q-item-label>
                    {{ accountingDetails[2]?.toParty.organizationName }}
                  </q-item-label>
                  <q-item-label>
                    {{
                      accountingDetails[2]?.toParty.emailAddress.substring(
                        0,
                        20
                      ) + "..."
                    }}
                  </q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <q-btn
                    @click="vendoPage(vendorDetails?.partyId)"
                    outline
                    rounded
                    no-caps
                    color="primary"
                    label="View"
                  />
                </q-item-section>
              </q-item>

              <q-item class="row wrap full-width">
                <q-item-section>
                  <q-item-label caption>Invoice:</q-item-label>
                  <q-item-label>
                    {{ accountingDetails[2].invoiceId }}
                  </q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <q-btn
                    @click="invoicePage(accountingDetails[2].invoiceId)"
                    outline
                    rounded
                    no-caps
                    color="primary"
                    label="View"
                  />
                </q-item-section>
              </q-item>

              <q-item class="row wrap full-width">
                <q-item-section>
                  <q-item-label caption>Posted date:</q-item-label>
                  <q-item-label>
                    {{
                      formateTimeStamp(accountingDetails[0].postedDate)
                        .formattedTimestamp
                    }}
                    {{ formateTimeStamp(accountingDetails[0].postedDate).time }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </div>

          <q-separator size="2px" :vertical="!$q.screen.lt.lg ? true : false" />

          <!-- right -->
          <div class="q-pa-lg" :class="!$q.screen.lt.lg ? 'col' : 'col-12'">
            <!-- title -->
            <div class="text-h6 full-width">
              General Ledger account transection details
            </div>

            <!-- items list -->
            <div
              class="q-pa-sm full-width q-my-md"
              style="border: 1px solid gray; border-radius: 20px"
            >
              <!-- columns -->
              <q-item class="text1">
                <q-item-section class="col-4 text-weight-bold text-h6">
                  Name
                </q-item-section>
                <q-item-section
                  class="col-3 text-weight-bold text-h6 text-green"
                >
                  Credit
                </q-item-section>
                <q-item-section class="col-3 text-weight-bold text-h6 text-red">
                  Debit
                </q-item-section>
                <q-item-section class="col-2 text-weight-bold text-h6">
                  Total
                </q-item-section>
              </q-item>

              <q-separator />

              <!-- rows -->
              <q-item v-for="data in accountingDetails" :key="data">
                <q-item-section class="col-4 text-weight-bold">
                  {{ data.accountName }}
                </q-item-section>

                <q-item-section
                  v-if="data.debitCreditFlag == 'C'"
                  class="col-3 text-weight-bold"
                >
                  {{ data.amount }}
                </q-item-section>

                <q-item-section v-else class="col-3 text-weight-bold">
                </q-item-section>

                <q-item-section
                  v-if="data.debitCreditFlag == 'D'"
                  class="col-3 text-weight-bold"
                >
                  {{ data.amount }}
                </q-item-section>
                <q-item-section
                  v-else
                  class="col-3 text-weight-bold"
                ></q-item-section>
                <q-item-section
                  v-if="data.debitCreditFlag"
                  class="col-2 text-weight-bold"
                >
                  ${{ data.amount }}
                </q-item-section>
              </q-item>
            </div>

            <!-- details -->
            <div class="full-width">
              <q-item>
                <q-item-section>
                  <q-item-label overline>Currency</q-item-label>
                  <q-item-label>
                    {{ accountingDetails[0].amountUomId }}
                  </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label overline> Accounting System: </q-item-label>
                  <q-item-label>
                    Posted: {{ accountingDetails[0].isPosted }}
                  </q-item-label>
                  <q-item-label>
                    {{
                      formateTimeStamp(accountingDetails[0].postedDate)
                        .formattedTimestamp
                    }}
                  </q-item-label>
                  <q-item-label>
                    {{ formateTimeStamp(accountingDetails[0].postedDate).time }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </div>
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

export default {
  name: "accountingInfo_page",
  setup() {
    const route = useRoute();

    const router = useRouter();
    const useAuth = useAuthStore();

    const accountingList = ref([]);
    const accountingDetails = ref([]);
    const vendorDetails = ref(null);

    // side list
    const searchInput = ref("");

    // getaccounting list
    function getAccountingList() {
      const params = {};

      params["pageSize"] = 40;
      params["pageIndex"] = 0;
      api({
        method: "GET",
        headers: useAuth.authKey,
        url: "accounting",
        params: params,
      })
        .then((res) => {
          accountingList.value.push(...res.data.transactionInfoList);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    function getAccountingInfo(id) {
      accountingDetails.value = [];
      vendorDetails.value = null;
      api({
        method: "GET",
        headers: useAuth.authKey,
        url: `accounting/${id}`,
      })
        .then((res) => {
          accountingDetails.value.push(
            ...res.data.transactionList[0].entryList
          );

          accountingDetails.value.push({
            invoiceDate: res.data.transactionList[0].invoiceDate,
            invoiceId: res.data.transactionList[0].invoiceId,
            invoiceTotal: res.data.transactionList[0].invoiceTotal,
            paymentDate: res.data.transactionList[0].paymentDate,
            toParty: res.data.transactionList[0].otherParty,
            fromParty: res.data.transactionList[0].fromParty,
          });

          console.log(accountingDetails.value);
        })

        .catch((err) => {
          console.log(err);
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
      getAccountingInfo(route.params.paymentId);
      getAccountingList();
    });

    return {
      formateTimeStamp,
      dateModifer,
      getAccountingInfo,
      accountingDetails,
      vendorDetails,

      vendoPage,
      invoicePage,
      router,

      // sidelist
      searchInput,
      accountingList,
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
