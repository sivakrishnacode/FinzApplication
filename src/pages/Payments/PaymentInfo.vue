<template>
  <div class="row no-wrap">
    <!-- sidelist -->
    <div style="width: 400px" v-if="!$q.screen.lt.md" class="fixed bg-red">
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
          class="scroll"
          style="border-radius: 10px; height: calc(100vh - 150px)"
        >
          <q-list class="q-gutter-sm">
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
              class="bg-secondary text-primary"
              style="border-radius: 5px"
              @click="getPaymentInfo(data.paymentDetail.paymentId)"
            >
              <!-- :active="
                data.transactionDetail.paymentId == paymentDetails[0]?.paymentId
                  ? true
                  : false
              "
              active-class="text-bold" -->
              <!-- avator -->
              <q-item-section class="">
                <q-item-label class="text-bold">
                  {{ data.paymentDetail.paymentId }}
                </q-item-label>
                <q-item-label class="text-bold">
                  {{ data.toParty.organizationName }}
                </q-item-label>
                <q-item-label>
                  {{ data.toParty.emailAddress }}
                </q-item-label>
              </q-item-section>

              <!-- name -->
              <q-item-section avatar>
                <q-item-label class="text-bold">
                  $ {{ data.paymentDetail.amount }}
                </q-item-label>
                <q-item-label>
                  {{ dateModifer(data.paymentDetail.effectiveDate) }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </div>
    <div style="width: 400px"></div>

    <!-- main -->
    <div class="full-width scroll bg-green">
      <!-- title bar -->
      <div class="row justify-center q-px-xl full-width">
        <div style="width: 700px">
          <div
            class="bg-secondary text-center q-pa-sm q-gutter-y-sm"
            style="border-radius: 0 0 70px 70px"
          >
            <div class="text-primary text-h6">
              invoiceDetail.fromParty?.organization.organizationName
            </div>
            <div class="text-blue-grey-1">invoiceDetail.invoiceId</div>

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
      <div class="row justify-center">
        <div style="width: 60%" class="full-height">
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
                  <q-item-label>Invoice Status:</q-item-label>
                </q-item-section>

                <q-item-section avatar>
                  <q-item-label>
                    <q-badge class="text-h6">
                      invoiceDetail.status?.description
                    </q-badge>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>

            <!-- vendor -->
            <div class="full-width q-py-md">
              <q-item>
                <q-item-section>
                  <q-item-label overline>Vendor Name:</q-item-label>
                  <q-item-label>
                    invoiceDetail.fromParty?.organization.organizationName
                  </q-item-label>
                </q-item-section>

                <q-item-section avatar>
                  <q-btn outline rounded color="primary" label="View Vendor" />
                </q-item-section>
              </q-item>
            </div>

            <!-- organization -->
            <div class="full-width q-py-md">
              <q-item>
                <q-item-section>
                  <q-item-label overline>Organization Name:</q-item-label>
                  <q-item-label>
                    invoiceDetail.toParty?.organization.organizationName
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>

            <!-- view invoice -->
            <div class="full-width q-py-sm">
              <q-item>
                <q-item-section>
                  <q-item-label overline>View Invoice:</q-item-label>
                  <q-item-label> invoiceDetail.externalId </q-item-label>
                </q-item-section>

                <q-item-section avatar>
                  <q-btn outline rounded color="primary" label="View Invoice" />
                </q-item-section>
              </q-item>
            </div>
          </div>

          <!-- body 2-->
          <div
            class="row justify-center q-my-md q-pa-lg bg-secondary"
            style="border-radius: 20px"
          >
            <!-- refunded amt -->
            <div class="full-width q-py-md">
              <q-item>
                <q-item-section>
                  <q-item-label>Refunded Amount:</q-item-label>
                </q-item-section>

                <q-item-section avatar>
                  <q-item-label>
                    <q-badge class="text-h6"> $7690 </q-badge>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>

            <!-- Currency -->
            <div class="full-width q-py-md">
              <q-item>
                <q-item-section>
                  <q-item-label overline>Currency:</q-item-label>
                </q-item-section>

                <q-item-section avatar>
                  <q-item-label> INR </q-item-label>
                </q-item-section>
              </q-item>
            </div>

            <!-- organization -->
            <div class="full-width q-py-md">
              <q-item>
                <q-item-section>
                  <q-item-label overline>UTR Number:</q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <q-item-label> 64645654656 </q-item-label>
                </q-item-section>
              </q-item>
            </div>

            <!-- view invoice -->
            <div class="full-width q-py-sm">
              <q-item>
                <q-item-section>
                  <q-item-label overline>Payment method:</q-item-label>
                </q-item-section>

                <q-item-section avatar>
                  <q-item-label> UPI </q-item-label>
                </q-item-section>
              </q-item>
            </div>

            <div class="full-width q-py-sm">
              <q-item>
                <q-item-section>
                  <q-item-label overline>UPI ID:</q-item-label>
                </q-item-section>

                <q-item-section avatar>
                  <q-item-label> UPIhdfc34336 </q-item-label>
                </q-item-section>
              </q-item>
            </div>

            <div class="full-width q-py-sm">
              <q-item>
                <q-item-section>
                  <q-item-label overline>Comments:</q-item-label>
                </q-item-section>

                <q-item-section>
                  <q-item-label>
                    To get the first N characters of a string in JavaScript,
                    call the slice() method on the string, passing 0 as the
                    first argument and N as the second. For example, str.
                    slice(0, 2) returns a new string containing the first 2
                    characters of str .
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </div>

          <!-- body 3 -->
          <div
            class="row justify-center q-my-md q-pa-lg bg-secondary"
            style="border-radius: 20px"
          >
            <!-- status -->
            <div class="full-width q-py-md">
              <q-item>
                <q-item-section>
                  <q-item-label>Invoice Status:</q-item-label>
                </q-item-section>

                <q-item-section avatar>
                  <q-item-label>
                    <q-badge class="text-h6">
                      invoiceDetail.status?.description
                    </q-badge>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>

            <!-- vendor -->
            <div class="full-width q-py-md">
              <q-item>
                <q-item-section>
                  <q-item-label overline>Vendor Name:</q-item-label>
                  <q-item-label>
                    invoiceDetail.fromParty?.organization.organizationName
                  </q-item-label>
                </q-item-section>

                <q-item-section avatar>
                  <q-btn outline rounded color="primary" label="View Vendor" />
                </q-item-section>
              </q-item>
            </div>
          </div>

          <!--payment history -->
          <div class="bg-secondary q-pa-lg" style="border-radius: 13px">
            <div class="text-h5 q-pa-md" style="text-decoration: underline">
              Payment History:
            </div>
            <q-item class="q-my-sm" v-for="data in 4" :key="data">
              <q-item-section>
                <q-item-label>
                  Date : formateTimeStamp(data.changedDate).formattedTimestamp
                </q-item-label>
                <q-item-label overline>
                  Time : formateTimeStamp(data.changedDate).time
                </q-item-label>
              </q-item-section>

              <q-item-section avatar>
                <q-item-label class="text-h6 text-green">
                  <q-badge class="text-body1" color="secondary">
                    data.description
                  </q-badge>
                </q-item-label>
                <q-item-label overline> by data.username </q-item-label>
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

export default {
  name: "paymentInfo_page",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const useAuth = useAuthStore();

    const paymentList = ref([]);
    const paymentDetails = ref({});

    // side list
    const searchInput = ref("");

    // getaccounting list
    function getPaymentList() {
      const params = {};

      params["pageSize"] = 40;
      params["pageIndex"] = 0;
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
          paymentDetails.value = res.data.entryLists;
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

    function vendoPage(id) {
      router.push({
        name: "vendorInfo_page",
        params: {
          vendorId: id,
        },
      });
    }

    onMounted(() => {
      getPaymentInfo(route.params.paymentId);
      getPaymentList();
    });

    return {
      formateTimeStamp,
      dateModifer,
      getPaymentInfo,
      paymentDetails,

      vendoPage,

      // sidelist
      searchInput,
      paymentList,
    };
  },
};
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  display: none;
}
</style>
