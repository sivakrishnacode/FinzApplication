<template>
  <div class="row no-wrap">
    <!-- Side list -->
    <div
      class="q-gutter-y-sm q-pa-lg"
      style="width: 400px"
      v-if="!$q.screen.lt.md"
    >
      <!-- upload invoice btn -->
      <div>
        <q-btn
          dense
          rounded
          size="16px"
          color="primary"
          class="full-width"
          label="Upload Invoice"
          no-caps
          icon="upload"
          no-wrap
          @click="selectFile"
        />
        <q-file
          v-model="invoiceFile"
          type="file"
          ref="fileInputRef"
          rounded
          outlined
          style="opacity: 0; position: absolute; max-width: 1px; top: 125px"
          @update:model-value="invoiceFileUpload"
        >
        </q-file>
      </div>

      <!-- search & date filter -->
      <div class="row no-wrap full-width">
        <!-- search input -->
        <q-select
          dense
          outlined
          rounded
          v-model="search"
          class="q-pr-md"
          clearable
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          option-label="organizationName"
          option-value="partyId"
          :options="searchOptions"
          @filter="searchVendor"
          :style="$q.screen.lt.sm ? { width: '300px' } : { width: '400px' }"
        >
          <template #append>
            <q-icon name="search" />
          </template>

          <template v-slot:no-option>
            <q-item class="text-center">
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>

          <template v-slot:option="scope">
            <div
              :style="$q.screen.lt.sm ? { width: '300px' } : { width: '400px' }"
            >
              <q-item
                clickable
                class="full-width q-pa-md text-center"
                v-bind="scope.itemProps"
              >
                <q-item-section
                  class="full-width"
                  @click="
                    selectVendor(scope.opt.partyId, scope.opt.organizationName),
                      (search = '')
                  "
                >
                  <q-item-label>{{ scope.opt.organizationName }}</q-item-label>
                  <q-item-label caption>{{ scope.opt.partyId }}</q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </template>
        </q-select>
        <!-- date filter -->

        <q-btn color="primary" icon="filter_alt" rounded>
          <q-menu
            style="border-radius: 8px"
            class="shadow-8"
            ref="isfilterPopActive"
          >
            <q-list>
              <q-item
                dense
                clickable
                v-ripple
                tag="label"
                v-for="data in daysEnumerationsList"
                :key="data.enumId"
                class="q-py-md"
              >
                <q-item-section avatar>
                  <q-radio
                    v-model="daysFilterValue"
                    :val="data"
                    dense
                    @update:model-value="applyDaysFilter"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ data.description }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-separator v-if="isDateRangeFilterActive" spaced />

              <!--  date range filter section -->
              <div
                class="q-mx-sm q-mb-sm q-gutter-y-sm column items-center"
                v-if="isDateRangeFilterActive"
              >
                <div class="text-primary">Date Range</div>

                <!-- get from date -->
                <q-input
                  outlined
                  v-model="dateRange.fromDate"
                  mask="##-##-####"
                  dense
                  label="DD-MM-YYYY"
                  readonly
                  hint="From date"
                  @click="$refs.fromDatePopUpRef.show()"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer" color="primary">
                      <q-popup-proxy
                        cover
                        ref="fromDatePopUpRef"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date v-model="dateRange.fromDate" mask="DD-MM-YYYY">
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>

                <!-- get to date -->
                <q-input
                  outlined
                  v-model="dateRange.thruDate"
                  mask="##-##-####"
                  dense
                  label="DD-MM-YYYY"
                  readonly
                  hint="To Date"
                  @click="$refs.toDatePopUpRef.show()"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer" color="primary">
                      <q-popup-proxy
                        cover
                        ref="toDatePopUpRef"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date v-model="dateRange.thruDate" mask="DD-MM-YYYY">
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>

                <q-btn label="Apply" color="primary" @click="applyDateFilter" />
              </div>
            </q-list>
          </q-menu>
        </q-btn>
      </div>

      <!-- file preview dialog -->
      <q-dialog v-model="previewDialog" persistent>
        <div
          style="border-radius: 10px; width: 400px"
          class="fit full-height bg-blue-grey-1"
        >
          <div id="pdf-viewer" style="height: 780px"></div>

          <div class="row justify-evenly q-py-md">
            <q-btn
              rounded
              label="Cancel"
              color="red"
              v-close-popup
              @click="closePreview()"
            ></q-btn>
            <q-btn
              rounded
              label="Submit"
              :loading="isFileUploading"
              color="primary"
              @click="fileUploadHandler()"
            >
              <template v-slot:loading>
                <q-spinner color="white" />
              </template>
            </q-btn>
          </div>
        </div>
      </q-dialog>

      <!-- filter preview chip -->
      <div class="row justify-center">
        <q-chip
          v-model="isDaysFilterActive"
          color="primary"
          removable
          text-color="white"
          :label="daysFilterSelected"
          @remove="
            (isDaysFilterActive = false),
              ((daysFilterSelected = ''),
              (daysFilterValue = ''),
              (daysFilterValue = '')),
              getInvoiceList(),
              clearInvoiceList()
          "
        />

        <q-chip
          v-model="isDateFilterActiveForChip"
          color="primary"
          removable
          text-color="white"
          :label="dateRange.fromDate + ' - ' + dateRange.thruDate"
          @remove="removeFilter('DataFilter')"
        />
        <q-chip
          v-model="isVendorFilterActiveForChip"
          color="primary"
          removable
          text-color="white"
          :label="vendorFilterSelected.name"
          @remove="
            ((vendorFilterSelected.partyId = ''), (search = '')),
              getInvoiceList(),
              clearInvoiceList()
          "
        />
      </div>

      <!-- tabs -->
      <div>
        <q-tabs
          v-model="currentTab"
          active-color="white bg-primary"
          class="q-mx-md bg-grey-2"
          indicator-color="transparent"
          no-caps
          switch-indicator
          :mobile-arrows="false"
          dense
          outside-arrows
          style="border-radius: 12px; border: 1px solid silver"
        >
          <q-tab
            v-for="data in enumTabList"
            :key="data"
            :label="data.description"
            :name="data.enumId"
            @click="
              (currentTab = data.enumId), getInvoiceList(), clearInvoiceList()
            "
            style="border-radius: 19px"
          />
        </q-tabs>
      </div>

      <!-- SCROLL area -->
      <div
        class="q-pa-sm scroll"
        style="border-radius: 10px; height: 100vh"
        ref="invoiceListScrollRef"
      >
        <!-- List -->
        <q-list class="q-gutter-sm">
          <div
            v-if="invoiceList.length == 0"
            class="row justify-center q-pa-lg text-bold text-h6 text-primary"
          >
            No data
          </div>
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
              <q-item-label class="text-bold">
                {{ data.organizationName }}
              </q-item-label>
              <q-item-label> {{ data.invoiceId }} </q-item-label>
              <q-item-label class="text-bold">
                email not Received
              </q-item-label>
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
                  :color="statusColor(data.statusId)?.color"
                  :label="statusColor(data.statusId)?.message"
                >
                </q-badge>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>

    <!-- Invoice Info side -->
    <div class="full-width">
      <!-- title bar -->
      <div class="row justify-center q-px-xl full-width">
        <div style="width: 700px">
          <div
            class="bg-secondary text-center q-pa-sm q-gutter-y-sm"
            style="border-radius: 0 0 70px 70px"
          >
            <div class="text-primary text-h6">
              {{ invoiceDetail.fromParty?.organization.organizationName }}
            </div>
            <div class="text-blue-grey-1">
              {{ invoiceDetail.invoiceId }}
            </div>

            <!-- cancel btn -->
            <div class="row absolute" style="top: 50px; right: 70px">
              <div
                class="bg-secondary"
                style="border-radius: 0 0 70px 70px; height: 50px"
              >
                <q-btn
                  size="15px"
                  icon="close"
                  color="primary"
                  flat
                  @click="router.back()"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- body -->
      <div class="row full-width">
        <!-- center body -->
        <div
          class="row justify-center"
          :class="$q.screen.lt.lg ? 'col-12' : 'col-8'"
        >
          <div style="width: 90%" class="full-height">
            <!-- items -->
            <div style="border-radius: 13px" class="bg-secondary q-ma-sm">
              <!-- body -->
              <div
                class="row justify-center q-my-md q-pa-lg"
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
                        <q-badge
                          :color="
                            statusColor(invoiceDetail.status?.statusId)?.color
                          "
                          class="text-h6"
                        >
                          {{ invoiceDetail.status?.description }}
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
                      <q-item-label>{{
                        invoiceDetail.fromParty?.organization.organizationName
                      }}</q-item-label>
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
                      <q-item-label>{{
                        invoiceDetail.toParty?.organization.organizationName
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </div>

                <!-- view invoice -->
                <div class="full-width q-py-sm">
                  <q-item>
                    <q-item-section>
                      <q-item-label overline>View Invoice:</q-item-label>
                      <q-item-label>{{
                        invoiceDetail.externalId
                      }}</q-item-label>
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

                <!-- items list -->
                <div class="full-width q-pa-sm" style="border: 1px solid black">
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
                </div>
              </div>
            </div>

            <!-- transections -->
            <div
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
                  <q-item-label>
                    Payment ID: {{ data.paymentId }}
                  </q-item-label>
                  <q-item-label overline>
                    Applied date :
                    {{ formateTimeStamp(data.appliedDate).formattedTimestamp }}
                  </q-item-label>
                </q-item-section>

                <q-item-section avatar>
                  <q-item-label>
                    <q-badge color="green">
                      $ {{ data.amountApplied }}
                    </q-badge>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>

            <!-- history -->
            <div
              class="bg-secondary q-pa-lg q-ma-sm"
              style="border-radius: 13px"
            >
              <div class="text-h5 q-pa-md" style="text-decoration: underline">
                Invoice History:
              </div>
              <q-item
                class="q-my-sm"
                v-for="data in invoiceDetail.invoiceHistory"
                :key="data"
              >
                <q-item-section>
                  <q-item-label
                    >Date :
                    {{
                      formateTimeStamp(data.changedDate).formattedTimestamp
                    }}</q-item-label
                  >
                  <q-item-label overline
                    >Time :{{
                      formateTimeStamp(data.changedDate).time
                    }}</q-item-label
                  >
                </q-item-section>

                <q-item-section avatar>
                  <q-item-label class="text-h6 text-green">
                    <q-badge
                      class="text-body1"
                      color="secondary"
                      :text-color="statusColor(data.newValueText)?.color"
                    >
                      {{ data.description }}
                    </q-badge>
                  </q-item-label>
                  <q-item-label overline> by {{ data.username }} </q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </div>
        </div>

        <!-- right side -->
        <div
          class="row justify-center q-mt-md"
          :class="$q.screen.lt.lg ? 'col-12' : 'col-4'"
        >
          <div style="width: 90%" class="q-gutter-y-md">
            <!-- amount -->
            <div class="bg-secondary q-pa-lg" style="border-radius: 13px">
              <!-- total -->
              <q-item class="q-my-sm">
                <q-item-section>
                  <q-item-label>Total Amount:</q-item-label>
                </q-item-section>

                <q-item-section avatar>
                  <q-item-label>{{ invoiceDetail.invoiceTotal }}</q-item-label>
                </q-item-section>
              </q-item>

              <!-- paid -->
              <q-item class="q-my-sm">
                <q-item-section>
                  <q-item-label>Paid Amount:</q-item-label>
                </q-item-section>

                <q-item-section avatar>
                  <q-item-label>
                    {{ invoiceDetail.invoiceTotal - invoiceDetail.unpaidTotal }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <!-- unpaid -->
              <q-item class="q-my-sm">
                <q-item-section>
                  <q-item-label>UnPaid Amount:</q-item-label>
                </q-item-section>

                <q-item-section avatar>
                  <q-item-label>{{ invoiceDetail.unpaidTotal }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-separator spaced />

              <!-- btns -->
              <div class="q-pa-md row justify-evenly">
                <!-- <q-btn
                  label="Refund"
                  rounded
                  color="primary"
                  @click="startRefund()"
                />

                <div v-if="invoiceDetail.statusId == 'InvoiceIncoming'">
                  <q-btn
                    rounded
                    outline
                    label="Approve"
                    color="primary"
                    @click="changeInvoiceStatus('approve')"
                  />
                </div>

                <q-btn
                  v-if="invoiceDetail.statusId == 'InvoiceApproved'"
                  rounded
                  label="Pay"
                  color="primary"
                  @click="redirect('invoicePayPage')"
                /> -->
                <q-btn
                  v-if="invoiceDetail.statusId == 'InvoiceApproved'"
                  rounded
                  label="Pay"
                  color="primary"
                  @click="redirect('invoicePayPage')"
                />

                <q-btn
                  v-if="invoiceDetail.statusId == 'InvoicePmtSent'"
                  label="Refund"
                  rounded
                  color="primary"
                  @click="startRefund()"
                />

                <div v-for="data in toStatusFlow" :key="data">
                  <div v-if="data.description == 'Approved'">
                    <q-btn
                      rounded
                      label="Approve"
                      color="primary"
                      @click="changeInvoiceStatus(data)"
                    />
                  </div>

                  <div v-if="data.description === 'Approved'"></div>

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
                      @click="redirect('invoicePayPage')"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter, useRoute } from "vue-router";
import { onMounted, ref, nextTick } from "vue";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/stores/useAuthStore";
import { useQuasar } from "quasar";

export default {
  name: "invoiceInfo_page",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const useAuth = useAuthStore();
    const $q = useQuasar();

    const id = route.params.invoiceId;

    // side list items
    const hasMoreDataToLoad = ref(true);
    const invoiceListScrollRef = ref(null);
    const enumTabList = ref([]);
    const currentTab = ref("allInvoice");
    const invoiceList = ref([]);
    const search = ref("");

    const index = ref(0);

    // date filter section
    const daysEnumerationsList = ref([]);
    const daysFilterValue = ref("");
    const isDateRangeFilterActive = ref(false);

    const isDaysFilterActive = ref(false);
    const isDateFilterActiveForChip = ref(false);
    const daysFilterSelected = ref("");

    // vendor search
    const isLoading = ref(false);
    const searchOptions = ref([]);
    const isVendorFilterActiveForChip = ref(false);
    const vendorFilterSelected = ref({
      name: "",
      partyId: "",
    });

    const isfilterPopActive = ref(null);

    const dateRange = ref({
      fromDate: "",
      toDate: "",
    });
    const correctDateRange = ref({
      fromDate: "",
      thruDate: "",
    });

    // invoice info items
    const invoiceDetail = ref({});
    const toStatusFlow = ref([]);

    // file upload
    // upload section
    const invoiceFile = ref(null);
    const invoiceFileType = ref(null);
    const invoiceFileName = ref(null);

    const previewDialog = ref(false);
    const approveConfirmDailog = ref(false);
    const cancelConfirmDailog = ref(false);

    const isFileImage = ref(false);
    const fileInputRef = ref(null);
    const isFileUploading = ref(false);
    const tempFileUrl = ref("");

    function getInvoiceList() {
      var params = {};

      if (currentTab.value) {
        params["statusId"] = currentTab.value;
      }

      if (vendorFilterSelected.value.partyId != "") {
        params["partyId"] = vendorFilterSelected.value.partyId;
      }

      if (daysFilterValue.value.enumId == "DATE_RANGE") {
        params["dateFilterId"] = "DATE_RANGE";
      } else if (daysFilterValue.value.enumId !== undefined) {
        params["dateFilterId"] = daysFilterValue.value.enumId;
      }

      if (
        correctDateRange.value.fromDate !== "" &&
        correctDateRange.value.thruDate !== ""
      ) {
        params["fromDate"] = correctDateRange.value.fromDate;
        params["thruDate"] = correctDateRange.value.thruDate;
      }

      // params["pageSize"] =
      // calcPageSizeLimit(
      //   invoiceListScrollRef.value.clientHeight,
      //   60
      // );
      // params["index"] = index.value;

      params["pageSize"] = 40;
      params["index"] = 0;

      if (hasMoreDataToLoad.value) {
        api({
          method: "GET",
          headers: useAuth.authKey,
          url: "invoices",
          params: params,
        })
          .then((res) => {
            res.data.invoiceList.map((data) => {
              invoiceList.value.push(data);
            });

            if (res.data.invoiceListCount < invoiceList.value.length) {
              hasMoreDataToLoad.value = false;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }

    const calcPageSizeLimit = (scrollContainerHeight, innerItemHeight) => {
      return Math.round(scrollContainerHeight / innerItemHeight);
    };

    function clearInvoiceList() {
      invoiceList.value = [];
    }

    let prevScrollTop = 0;
    const scrollHandler = () => {
      let scrollHeight = invoiceListScrollRef.value.scrollHeight;
      let scrollTop = invoiceListScrollRef.value.scrollTop;
      let clientHeight = invoiceListScrollRef.value.clientHeight;

      //fetch vendors based on scroll
      if (prevScrollTop < scrollTop) {
        if (scrollTop + clientHeight + 1 > scrollHeight) {
          index.value++;
          //getInvoiceList();
          //get vendors
        }
      }

      prevScrollTop = scrollTop;
    };

    async function getInvoiceDetails(invoiseId) {
      invoiceDetail.value = "";
      await api({
        method: "GET",
        url: `invoices/${invoiseId}`,
        headers: useAuth.authKey,
      }).then((res) => {
        invoiceDetail.value = res.data;
      });
      console.log(invoiceDetail.value, "invoice details");
      route.params.invoiceId = invoiceDetail.value.invoiceId;
      getInvoiceHistory(invoiceDetail.value.invoiceId);
      getToStatusFlow(invoiceDetail.value.statusId);
    }

    function getInvoiceHistory(id) {
      api({
        method: "GET",
        url: "/userStatusHistory",
        params: {
          invoiceId: id,
        },
        headers: useAuth.authKey,
      }).then((res) => {
        invoiceDetail.value["invoiceHistory"] = res.data.invoiceHistoryList;
      });
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
        console.log(toStatusFlow.value);
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
      getInvoiceDetails(route.params.invoiceId);
      clearInvoiceList();
      getInvoiceList();
    }

    function redirect(page) {
      if (page == "invoicePayPage") {
        router.push({
          name: "payment",
          params: {
            invoice: id,
          },
        });
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

    function getDateFilterEnumList() {
      api({
        method: "GET",
        url: "enumeration",
        headers: useAuth.authKey,
        params: {
          enumTypeId: "DateFilterType",
        },
      })
        .then(async (res) => {
          res.data.enumerationList.map((res) => {
            daysEnumerationsList.value.push(res);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }

    function applyDaysFilter() {
      isDaysFilterActive.value = true;

      daysFilterSelected.value = daysFilterValue.value.description;

      if (daysFilterValue.value.enumId == "DATE_RANGE") {
        isDaysFilterActive.value = false;
        isDateRangeFilterActive.value = true;
      } else {
        isDateRangeFilterActive.value = false;

        clearInvoiceList();
        getInvoiceList();

        isfilterPopActive.value.hide();
      }
    }

    function applyDateFilter() {
      isDateFilterActiveForChip.value = true;
      correctDateRange.value.fromDate = reverseDate(dateRange.value.fromDate);
      correctDateRange.value.thruDate = reverseDate(dateRange.value.thruDate);
      clearInvoiceList();
      getInvoiceList();
      isfilterPopActive.value.hide();
    }

    async function selectVendor(id, name) {
      search.value = "";
      isVendorFilterActiveForChip.value = true;
      vendorFilterSelected.value.name = name;
      vendorFilterSelected.value.partyId = id;
      clearInvoiceList();
      getInvoiceList();
    }

    async function searchVendor(val, update) {
      isLoading.value = true;

      await update(() => {
        if (val != "") {
          api({
            method: "GET",
            url: `vendors?anyField=${val}`,
            headers: useAuth.authKey,
          }).then((res) => {
            searchOptions.value = [];
            searchOptions.value.push(...res.data.documentList);
            // res.data.documentList.map((data) => {
            //   searchOptions.value.push(data);
            // });

            isLoading.value = false;
          });
        } else {
          searchOptions.value = [];
          isLoading.value = false;
        }
      });
    }

    function startRefund() {
      const params = {
        invoiceId: invoiceDetail.value.invoiceId,
        refundAmount: 300,
        comments: "commandss",
        updateInvoice: "{false}",
      };

      api({
        method: "POST",
        url: "payments/refundPayment",
        headers: useAuth.authKey,
        params: params,
      });
    }

    // date converter function
    const reverseDate = (date) => {
      if (date !== null) {
        const part = date.split("-");
        return part[2] + "-" + part[1] + "-" + part[0];
      }
    };

    function removeFilter(type) {
      if (type == "DataFilter") {
        correctDateRange.value.fromDate = "";
        correctDateRange.value.toDate = "";
        dateRange.value.fromDate = "";
        dateRange.value.toDate = "";
        isDateFilterActiveForChip.value = false;
        daysFilterValue.value = "";
        isDateRangeFilterActive.value = false;
        clearInvoiceList();
        getInvoiceList();
      }
    }

    // Status Color
    const statusColor = (statusId) => {
      const colors = [
        {
          statusId: "InvoiceReceived",
          color: "light-blue-9",
          message: "Reveived",
        },
        {
          statusId: "InvoiceIncoming",
          color: "orange-10",
          message: "Incoming",
        },
        { statusId: "InvoicePmtSent", color: "green-8", message: "Sended" },
        { statusId: "InvoiceCancelled", color: "red-8", message: "Cancelled" },
        {
          statusId: "InvoiceApproved",
          color: "indigo-10",
          message: "Approved",
        },
        {
          statusId: "InvoiceAcked",
          color: "yellow-10",
          message: "Acknowledged",
        },
      ];

      const data = colors.find((data) => {
        if (data.statusId == statusId) {
          return data;
        }
      });

      if (data) {
        return data;
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

    //  file upload
    function invoiceFileUpload() {
      invoiceFileType.value = invoiceFile.value.type;
      invoiceFileName.value = invoiceFile.value.name;

      tempFileUrl.value = URL.createObjectURL(invoiceFile.value);

      nextTick(() => {
        var adobeDCView = new AdobeDC.View({
          clientId: "2dca231a9daf4cba8ee969c8274088eb",
          divId: "pdf-viewer",
        });

        adobeDCView.previewFile(
          {
            content: { location: { url: tempFileUrl.value } },
            metaData: { fileName: invoiceFileName.value },
          },
          {
            embedMode: "SIZED_CONTAINER",
            showDownloadPDF: false,
            showPrintPDF: false,
          }
        );
      });

      previewDialog.value = true;
      isFileImage.value = false;

      // if (invoiceFileType.value.includes("image/")) {
      //   previewDialog.value = true;
      //   isFileImage.value = true;
      // } else {
      //   previewDialog.value = true;
      //   isFileImage.value = false;
      // }
    }

    const fileUploadHandler = () => {
      isFileUploading.value = true;

      var formData = new FormData();
      formData.append("wikiSpaceId", "Invoices");
      formData.append("attachmentFile", invoiceFile.value);

      api({
        method: "POST",
        url: "invoices/uploadInvoice",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        headers: useAuth.authKey,
      })
        .then((res) => {
          isFileUploading.value = false;
          previewDialog.value = false;
          $q.notify({
            position: "top-right",
            message: "Invoice Uploaded Succesfully",
            type: "positive",
            icon: "done",
          });
        })
        .catch((err) => {
          $q.notify({
            position: "top-right",
            message: err.response.data.errors,
            type: "negative",
            icon: "cancel",
          });
          isFileUploading.value = false;
        });
      getInvoiceList();
    };

    const closePreview = () => {
      previewDialog.value = false;
      tempFileUrl.value = "";
      invoiceFile.value = null;
    };

    const selectFile = () => {
      fileInputRef.value.pickFiles();
    };

    function paymentPage(id) {
      router.push({
        name: "paymentInfo_page",
        params: {
          paymentId: id,
        },
      });
    }

    onMounted(() => {
      getInvoiceDetails(route.params.invoiceId);
      getTabEnumList();
      getDateFilterEnumList();
      clearInvoiceList();
      getInvoiceList();

      invoiceListScrollRef.value.addEventListener("scroll", scrollHandler);
    });

    return {
      // file upload
      invoiceFileUpload,
      fileUploadHandler,
      closePreview,
      selectFile,
      isFileUploading,
      invoiceFile,
      approveConfirmDailog,
      cancelConfirmDailog,
      previewDialog,
      fileInputRef,

      id,
      vendoPage,

      // side list
      invoiceListScrollRef,
      clearInvoiceList,

      invoiceList,
      enumTabList,
      getInvoiceList,
      currentTab,
      getInvoiceDetails,
      search,
      searchVendor,
      searchOptions,
      selectVendor,
      redirect,

      // filters
      isLoading,
      daysEnumerationsList,
      applyDaysFilter,
      daysFilterValue,
      isDateRangeFilterActive,
      removeFilter,

      // days
      isDaysFilterActive,
      daysFilterSelected,

      isfilterPopActive,

      // date filter
      dateRange,
      applyDateFilter,
      isDateFilterActiveForChip,

      // vendor filter
      isVendorFilterActiveForChip,
      vendorFilterSelected,

      // invoice info side
      invoiceDetail,
      toStatusFlow,
      changeInvoiceStatus,
      statusColor,
      router,
      formateTimeStamp,
      paymentPage,
      startRefund,
    };
  },
};
</script>

<style></style>
