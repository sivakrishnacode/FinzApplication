<template>
  <div class="row justify-between no-wrap">
    <!-- Side list -->
    <div
      class="q-gutter-y-sm q-pa-lg"
      style="width: 400px"
      v-if="!$q.screen.lt.md"
    >
      <q-input rounded outlined label="Search" dense>
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>

      <!-- upload invoice btn -->
      <q-btn
        rounded
        class="full-width"
        color="primary"
        label="Upload Invoice"
        no-caps
        icon="upload"
        no-wrap
        style="height: 20px"
      />

      <!-- tabs -->
      <div>
        <q-tabs
          v-model="currentTab"
          active-color="white bg-secondary"
          class="q-mx-md bg-grey-2"
          indicator-color="transparent"
          no-caps
          switch-indicator
          dense
          outside-arrows
          style="border-radius: 12px; border: 1px solid silver"
        >
          <q-tab
            v-for="data in enumTabList"
            :key="data"
            :label="data.description"
            :name="data.enumId"
            @click="(currentTab = data.enumId), getInvoiceList()"
          />
        </q-tabs>
      </div>

      <q-scroll-area
        class="q-pa-sm"
        style="border: 1px solid gray; border-radius: 10px; height: 650px"
      >
        <!-- List -->
        <q-list class="q-gutter-sm">
          <q-item
            v-for="data in invoiceList"
            :key="data"
            active-class="text-bold "
            clickable
            v-ripple
            class="bg-secondary text-primary"
            style="border-radius: 5px"
            @click="getInvoiceDetails(data.invoiceId)"
            :active="invoiceDetail.invoiceId === data.invoiceId ? true : false"
          >
            <!-- avator -->
            <q-item-section class="">
              <div class="q-gutter-y-md">
                <q-item-label class="text-bold">
                  {{ data.organizationName }}
                </q-item-label>
                <q-item-label> {{ data.invoiceId }} </q-item-label>
                <q-item-label class="text-bold">
                  email not Received
                </q-item-label>
              </div>
            </q-item-section>

            <!-- name -->
            <q-item-section avatar class="">
              <q-item-label class="text-bold">
                Total: {{ data.invoiceTotal }}
              </q-item-label>
              <q-item-label>Unpaid: {{ data.unpaidTotal }} </q-item-label>
              <q-item-label class="text-bold">
                <q-badge
                  rounded
                  :color="statusColor(data.statusId)"
                  :label="data.statusId"
                >
                </q-badge>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </div>

    <!-- Invoice Info side -->
    <div class="q-gutter-y-md column item-start full-width">
      <!-- title -->
      <div class="row full-width justify-center">
        <div
          class="bg-secondary text-center"
          style="border-radius: 0 0 70px 70px; width: 700px"
        >
          <div class="q-mt-md text-primary text-h6">
            {{ invoiceDetail.fromParty?.organization.organizationName }}
          </div>
          <div class="text-blue-grey-1 q-mb-sm">
            {{ invoiceDetail.invoiceId }}
          </div>
        </div>
      </div>

      <!-- status -->
      <div class="full-width row justify-center">
        <div
          class="row justify-between content-center q-pa-sm"
          style="width: 700px; border-radius: 20px; border: 1px solid gray"
        >
          <div class="row content-center q-pl-md" style="font-size: 20px">
            {{ invoiceDetail.statusId }}
          </div>
          <div class="row content-center q-gutter-x-sm">
            <div v-for="data in toStatusFlow" :key="data">
              <div v-if="data.description == 'Approved'">
                <q-btn
                  rounded
                  label="Approve"
                  color="primary"
                  @click="changeInvoiceStatus(data)"
                />
              </div>

              <div v-else-if="data.description == 'Cancelled'">
                <q-btn
                  rounded
                  outline
                  label="Cancel"
                  color="primary"
                  @click="changeInvoiceStatus(data)"
                />
              </div>

              <div v-else-if="data.description == 'Payment Sent'">
                <q-btn
                  rounded
                  label="Pay"
                  color="primary"
                  @click="changeInvoiceStatus(data)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- body -->
      <div class="row justify-center full-width">
        <div
          class="bg-secondary q-pa-lg"
          style="border-radius: 17px; width: 700px"
        >
          <q-scroll-area style="height: 600px">
            <div class="q-gutter-y-md">
              <!-- vendor info -->
              <q-item class="row justify-between text-primary">
                <!-- left -->
                <q-item-section>
                  <q-item-label class="text-primary text-weight-bold">
                    {{ invoiceDetail.fromParty?.organization.organizationName }}
                  </q-item-label>
                  <q-item-label class="text-white text-caption">
                    email not Received
                  </q-item-label>
                </q-item-section>
                <!-- right -->

                <q-btn
                  outline
                  rounded
                  color="primary"
                  label="View"
                  @click="vendoPage(invoiceDetail.fromParty?.partyId)"
                />
              </q-item>

              <!-- invoice file -->
              <q-item class="row justify-between text-primary q-py-md">
                <!-- left -->
                <q-item-section>
                  <q-item-label class="text-primary text-weight-bold">
                    Invoice:
                  </q-item-label>
                  <q-item-label class="text-white text-caption">
                    {{ invoiceDetail.externalId }}
                  </q-item-label>
                </q-item-section>
                <!-- right -->

                <q-btn outline rounded color="primary" label="View Invoice">
                </q-btn>
              </q-item>
            </div>

            <!-- list items -->
            <div>
              <!-- columns -->
              <q-item class="row justify-between">
                <q-item-section class="col-1 text-weight-bold">
                  S.NO
                </q-item-section>
                <q-item-section class="col-4 text-weight-bold">
                  Product Name
                </q-item-section>
                <q-item-section
                  class="col-2 text-weight-bold row content-center"
                >
                  Quantity
                </q-item-section>
                <q-item-section
                  class="col-3 text-weight-bold row content-center"
                >
                  Price
                </q-item-section>
              </q-item>

              <q-separator />

              <!-- rows -->
              <q-list
                v-for="(data, index) in invoiceDetail.items"
                :key="data.invoiceId"
              >
                <q-item class="row justify-between text-primary">
                  <q-item-section class="col-1">{{ index + 1 }}</q-item-section>
                  <q-item-section class="col-4">{{
                    data.description
                  }}</q-item-section>
                  <q-item-section class="col-2 row content-center">
                    {{ data.quantity }}
                  </q-item-section>
                  <q-item-section class="col-3 row content-center">
                    {{ data.amount }}
                  </q-item-section>
                </q-item>
              </q-list>

              <q-separator />

              <!-- totals -->

              <div class="row justify-between q-pa-md">
                <div class="text-weight-bold">Total</div>
                <div>{{ invoiceDetail.invoiceTotal }}</div>
              </div>

              <div class="row justify-between q-pa-md">
                <div class="text-weight-bold">Paid Amount:</div>
                <div>
                  {{ invoiceDetail.invoiceTotal - invoiceDetail.unpaidTotal }}
                </div>
              </div>

              <div class="row justify-between q-pa-md">
                <div class="text-weight-bold">UnPaid Amount:</div>
                <div>{{ invoiceDetail.unpaidTotal }}</div>
              </div>

              <q-separator spaced />
            </div>

            <!-- invoice history -->
            <div class="q-pa-md">
              <div class="text-h6 text-primary">Invoice History:</div>
              <div
                class="row justify-between q-pa-md"
                style="border: 1px solid gray"
              >
                <div class="row content-center q-gutter-x-md">
                  <div class="text-h6">02-11-2022</div>
                  <div class="row content-center">06:45 AM</div>
                </div>
                <div class="">
                  <div
                    class="text-white text-wight-bold"
                    style="font-size: 20px"
                  >
                    Received
                  </div>
                  <div>by John Doe</div>
                </div>
              </div>
            </div>
          </q-scroll-area>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter, useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/stores/useAuthStore";

export default {
  name: "invoiceInfo_page",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const useAuth = useAuthStore();

    const id = route.params.invoiceId;

    // side list items
    const enumTabList = ref([]);
    const currentTab = ref("allInvoice");
    const invoiceList = ref([]);

    // invoice info items
    const invoiceDetail = ref("");
    const toStatusFlow = ref([]);

    function getInvoiceList() {
      invoiceList.value = [];
      api({
        method: "GET",
        headers: useAuth.authKey,
        url: "invoices",
        params: {
          statusId: currentTab.value,
        },
      })
        .then((res) => {
          res.data.invoiceList.map((data) => {
            invoiceList.value.push(data);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }

    async function getInvoiceDetails(invoiseId) {
      invoiceDetail.value = "";
      await api({
        method: "GET",
        url: `invoices/${invoiseId}`,
        headers: useAuth.authKey,
      }).then((res) => {
        invoiceDetail.value = res.data;
        console.log(invoiceDetail.value);
      });

      getToStatusFlow(invoiceDetail.value.statusId);
    }

    function getTabEnumList() {
      api({
        method: "GET",
        url: "enumeration",
        headers: useAuth.authKey,
        params: {
          enumTypeId: "UIInvoiceStatus",
        },
      }).then(async (res) => {
        res.data.enumerationList.map((data) => {
          enumTabList.value.push(data);
        });
      });
    }

    function getToStatusFlow(id) {
      toStatusFlow.value = [];
      api({
        method: "GET",
        headers: useAuth.authKey,
        url: "status/StatusFlowTransitionToDetail",
        params: {
          statusId: id,
        },
      }).then((data) => {
        data.data.statusDetailList.map((d) => {
          toStatusFlow.value.push(d);
        });
      });
    }

    async function changeInvoiceStatus(statusIds) {
      await api({
        method: "POST",
        headers: useAuth.authKey,
        url: "invoices/invoiceStatusUpdate",
        params: {
          invoiceId: invoiceDetail.value.invoiceId,
          vendorStatusId: statusIds.statusId,
          toStatusId: statusIds.toStatusId,
        },
      }).then((data) => {
        console.log(data);
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

    // Status Color
    const statusColor = (statusId) => {
      const colors = [
        { statusId: "InvoiceReceived", color: "light-blue-9" },
        { statusId: "InvoiceIncoming", color: "orange-10" },
        { statusId: "InvoicePmtSent", color: "green-8" },
        { statusId: "InvoiceCancelled", color: "red-8" },
        { statusId: "InvoiceApproved", color: "indigo-10" },
      ];

      const data = colors.find((data) => {
        if (data.statusId == statusId) {
          return data;
        }
      });

      if (data) {
        return data.color;
      }
    };

    onMounted(() => {
      getInvoiceDetails(route.params.invoiceId);
      getTabEnumList();
      getInvoiceList();
    });

    return {
      id,
      vendoPage,

      // side list
      invoiceList,
      enumTabList,
      getInvoiceList,
      currentTab,
      getInvoiceDetails,

      // invoice info side
      invoiceDetail,
      toStatusFlow,
      changeInvoiceStatus,
      statusColor,
    };
  },
};
</script>

<style></style>
