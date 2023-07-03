<template>
  <div class="row no-wrap">
    <!-- sidelist -->
    <div style="min-width: 400px">
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
          >
          </q-select>

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
            <div class="text-primary text-h6">invoiceDetail.fromParty</div>
            <div class="text-blue-grey-1">{{ paymentId }}</div>

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
                  1836390
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <!-- 2 -->
          <div class="col-4">
            <q-item>
              <q-item-section>
                <q-item-label class="row justify-center"
                  >payment ID</q-item-label
                >
                <q-item-label class="row justify-center text-h6">
                  1836390
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <!-- 3 -->
          <div class="col-4">
            <q-item>
              <q-item-section>
                <q-item-label class="row justify-center">
                  invoice ID
                </q-item-label>
                <q-item-label class="row justify-center text-h6"
                  >1836390</q-item-label
                >
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
              <q-item clickable v-ripple>
                <q-item-section>
                  <q-item-label caption>Organization:</q-item-label>
                  <q-item-label>Integrin Enterprice Solution</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-ripple class="q-my-lg">
                <q-item-section>
                  <q-item-label caption>Vendor:</q-item-label>
                  <q-item-label>Sivakrishna</q-item-label>
                  <q-item-label>sivakrishnacoc@gmail.com</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-ripple>
                <q-item-section>
                  <q-item-label caption>Posted date:</q-item-label>
                  <q-item-label>03-06-2023 12:45AM</q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </div>

          <!-- right -->
          <div
            class="bg-secondary q-ma-md full-width"
            style="border-radius: 15px"
          >
            <div class="q-pa-lg q-gutter-y-md">
              <!-- title -->
              <div class="text-h6">
                General Ledger account transection details
              </div>

              <!-- items list -->
              <div class="q-pa-sm" style="border: 1px solid black">
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
                <q-item v-for="data in 2" :key="data">
                  <q-item-section class="col-4 text-weight-bold">
                    tenent1234
                  </q-item-section>
                  <q-item-section class="col-3 text-weight-bold">
                    + $2340
                  </q-item-section>
                  <q-item-section class="col-3 text-weight-bold">
                    - $2340
                  </q-item-section>
                  <q-item-section class="col-2 text-weight-bold">
                    $2340
                  </q-item-section>
                </q-item>
              </div>

              <!-- details -->
              <div>
                <q-item>
                  <q-item-section>
                    <q-item-label overline>Currency</q-item-label>
                    <q-item-label>INR</q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label overline>Accounting System:</q-item-label>
                    <q-item-label>Posted</q-item-label>
                    <q-item-label>03-02-2023</q-item-label>
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

    var paymentId = route.params.paymentId;

    // getaccounting list
    function getAccountingList() {
      api({
        method: "GET",
        headers: useAuth.authKey,
        url: "accounting",
      })
        .then((res) => {
          console.log(res);
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
          // console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    // date formater 22 jun 2023
    const dateModifer = (val) => {
      if (val == undefined) {
        console.log("undef");
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

    onMounted(() => {
      getAccountingInfo(paymentId);
      getAccountingList();
    });
    return {
      paymentId,
      accountingList,
      dateModifer,
    };
  },
};
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  display: none;
}
</style>
