<template>
  <div class="row no-wrap">
    <!-- sidelist -->
    <div style="min-width: 400px">
      <div class="q-pa-md q-gutter-y-md">
        <!-- search and date -->
        <div class="row no-wrap">
          <!-- <q-select
            dense
            outlined
            rounded
            class="q-pr-md full-width"
            clearable
            use-input
            hide-selected
            fill-input
            input-debounce="0"
          >
          </q-select> -->

          <!-- date filter -->
          <q-btn color="primary" icon="filter_alt" rounded> </q-btn>
        </div>

        <!-- scroll area -->
        <div
          class="scroll"
          style="border-radius: 10px; height: calc(100vh - 150px)"
        >
          <q-list class="q-gutter-sm">
            <!-- <div
            v-if="invoiceList.length == 0"
            class="row justify-center q-pa-lg text-bold text-h6 text-primary"
          >
            No data
          </div> -->
            <q-item
              v-for="data in accountingList"
              :key="data"
              active-class="text-bold "
              clickable
              v-ripple
              class="bg-secondary text-primary"
              style="border-radius: 5px"
              @click="getAccountingInfo(data.transactionDetail.paymentId)"
            >
              <!-- avator -->
              <q-item-section class="">
                <q-item-label class="text-bold">
                  {{ data.transactionDetail.acctgTransId }}
                </q-item-label>
                <q-item-label class="text-bold">
                  {{ data.otherParty.organizationName }}
                </q-item-label>
                <q-item-label>
                  {{ data.otherParty.emailAddress }}
                </q-item-label>
              </q-item-section>

              <!-- name -->
              <q-item-section avatar>
                <q-item-label class="text-bold">
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
    <div class="full-width">
      <!-- title bar -->
      <div class="row justify-center q-px-xl full-width">
        <div style="width: 700px">
          <div
            class="bg-secondary text-center q-pa-sm q-gutter-y-sm"
            style="border-radius: 0 0 70px 70px"
          >
            <div class="text-primary text-h6">
              {{ accountingDetails[0]?.otherPartyName }}
            </div>
            <div class="text-blue-grey-1">
              {{ accountingDetails[0]?.paymentId }}
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

      <!-- ids row -->
      <div class="row justify-center q-mt-md">
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
                  {{ accountingDetails[0]?.acctgTransId }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <!-- 2 -->
          <div class="col-4">
            <q-item>
              <q-item-section>
                <q-item-label class="row justify-center">
                  payment ID
                </q-item-label>
                <q-item-label class="row justify-center text-h6">
                  {{ accountingDetails[0]?.paymentId }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <!-- 3 -->
          <div class="col-4">
            <q-item>
              <q-item-section>
                <q-item-label class="row justify-center">
                  Party ID
                </q-item-label>
                <q-item-label class="row justify-center text-h6">
                  {{ accountingDetails[0]?.otherPartyId }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </div>
      </div>

      <!-- body -->
      <div class="row justify-center">
        <div class="row no-wrap justify-center" style="width: 80%">
          <!-- left -->
          <div
            class="bg-secondary q-my-md q-mr-md"
            style="height: 600px; width: 40%; border-radius: 15px"
          >
            <div class="column justify-center full-height q-pa-md">
              <q-item>
                <q-item-section>
                  <q-item-label caption>Organization:</q-item-label>
                  <q-item-label>{{
                    accountingDetails[0]?.organizationName
                  }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item class="q-my-lg">
                <q-item-section>
                  <q-item-label caption>Vendor:</q-item-label>
                  <q-item-label>
                    {{ accountingDetails[0]?.otherPartyName }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Posted date:</q-item-label>
                  <q-item-label>
                    {{
                      formateTimeStamp(accountingDetails[0]?.postedDate)
                        .formattedTimestamp
                    }}
                  </q-item-label>
                  <q-item-label>
                    {{
                      formateTimeStamp(accountingDetails[0]?.postedDate).time
                    }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </div>

          <!-- right -->
          <div
            class="bg-secondary q-ma-md full-width"
            style="border-radius: 15px; height: 600px"
          >
            <div class="column justify-center q-pa-lg full-height">
              <!-- title -->
              <div class="text-h6">
                General Ledger account transection details
              </div>

              <!-- items list -->
              <div
                class="q-pa-sm"
                style="border: 1px solid gray; border-radius: 20px"
              >
                <!-- columns -->
                <q-item>
                  <q-item-section class="col-4 text-weight-bold text-h6">
                    Name
                  </q-item-section>
                  <q-item-section
                    class="col-3 text-weight-bold text-h6 text-green"
                  >
                    Credit
                  </q-item-section>
                  <q-item-section
                    class="col-3 text-weight-bold text-h6 text-red"
                  >
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
                  <q-item-section class="col-2 text-weight-bold">
                    ${{ data.amount }}
                  </q-item-section>
                </q-item>
              </div>

              <!-- details -->
              <div>
                <q-item>
                  <q-item-section>
                    <q-item-label overline>Currency</q-item-label>
                    <q-item-label>
                      {{ accountingDetails[0]?.amountUomId }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label overline> Accounting System: </q-item-label>
                    <q-item-label>
                      Posted:
                      {{ accountingDetails[0]?.isPosted }}
                    </q-item-label>
                    <q-item-label>
                      {{
                        formateTimeStamp(accountingDetails[0]?.postedDate)
                          .formattedTimestamp
                      }}
                    </q-item-label>
                    <q-item-label>
                      {{
                        formateTimeStamp(accountingDetails[0]?.postedDate).time
                      }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/stores/useAuthStore";

export default {
  name: "accountingInfo_page",
  setup() {
    const route = useRoute();
    const useAuth = useAuthStore();

    const accountingList = ref([]);
    const accountingDetails = ref({});

    // getaccounting list
    function getAccountingList() {
      api({
        method: "GET",
        headers: useAuth.authKey,
        url: "accounting",
      })
        .then((res) => {
          accountingList.value.push(...res.data.transactionInfoList);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    function getAccountingInfo(id) {
      api({
        method: "GET",
        headers: useAuth.authKey,
        url: `accounting/${id}`,
      })
        .then((res) => {
          accountingDetails.value = res.data.entryLists;
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

    onMounted(() => {
      getAccountingInfo(route.params.paymentId);
      getAccountingList();
    });

    return {
      accountingList,
      formateTimeStamp,
      dateModifer,
      getAccountingInfo,
      accountingDetails,
    };
  },
};
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  display: none;
}
</style>
