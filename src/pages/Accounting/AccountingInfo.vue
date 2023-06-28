<template>
  <div class="row no-wrap">
    <!-- sidelist -->
    <div class="bg-red" style="min-width: 400px" v-if="!$q.screen.lt.md">
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
              v-for="data in 12"
              :key="data"
              active-class="text-bold "
              clickable
              v-ripple
              class="bg-secondary text-primary"
              style="border-radius: 5px"
            >
              <!-- avator -->
              <q-item-section class="">
                <q-item-label> {{ acctgTransId }} </q-item-label>
                <q-item-label class="text-bold"> Sivakrishna </q-item-label>
                <q-item-label class="text-bold">
                  sivakrishnacoc@gmail.com
                </q-item-label>
              </q-item-section>

              <!-- name -->
              <q-item-section avatar class="">
                <q-item-label class="text-bold"> $ 4668 </q-item-label>

                <q-item-label class="text-bold">
                  <q-badge rounded color="green">Paid </q-badge>
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
            <div class="text-blue-grey-1">{{ acctgTransId }}</div>

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
            <div class="q-pa-lg">
              <div class="text-h6">
                General Ledger account transection details
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "accountingInfo_page",
  setup() {
    const route = useRoute();

    var acctgTransId = route.params.acctgTransId;
    onMounted(() => {
      console.log(acctgTransId);
    });
    return {
      acctgTransId,
    };
  },
};
</script>

<style lang="scss" scoped></style>
