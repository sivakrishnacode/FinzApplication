<template>
  <div class="q-mx-sm q-px-xl">
    <div class="column items-center q-pt-md">
      <!-- search and days filter -->
      <div class="row">
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

      <!-- quick filter -->
      <div class="q-pa-md">
        <q-tabs
          v-model="currentTab"
          active-color="white bg-primary"
          class="q-mx-md bg-grey-2 q-pa-sm"
          indicator-color="transparent"
          no-caps
          dense
          style="border-radius: 12px; border: 1px solid silver"
          @update:model-value="getPayments(daysFilterValue.enumId)"
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

      <div>
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
              getPayments()
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
            ((vendorFilterSelected.partyId = ''), (search = '')), getPayments()
          "
        />
      </div>
    </div>

    <!-- Preview box -->

    <!-- filter preview chip -->

    <!-- Table -->
    <div
      class="table-container"
      style="border: 2px solid silver; border-radius: 19px"
    >
      <q-table
        :rows="rows"
        ref="tableRef"
        :columns="columns"
        @request="getPayments()"
        separator="horizontal"
        class="q-py-md"
        :pagination="pagination"
        flat
        hide-bottom
        style="border-radius: 20px"
      >
        <!-- header -->
        <template v-slot:header="props">
          <q-tr :props="props" class="text-weight-bold text-primary">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              <div style="font-size: larger">
                {{ col.label }}
              </div>
            </q-th>
          </q-tr>
        </template>

        <!-- body -->
        <template #body="props">
          <q-tr
            :props="props"
            class="text-center cursor-pointer"
            @click="paymentRedirect(props.row.paymentDetail.paymentId)"
          >
            <q-td key="date" style="font-size: 15px">
              {{
                formateTimeStamp(props.row.paymentDetail.effectiveDate)
                  .formattedTimestamp
              }}
            </q-td>

            <q-td key="PaymentDate" style="font-size: 15px">
              {{ props.row.paymentDetail.paymentId }}
            </q-td>

            <q-td key="invoiceId" style="font-size: 15px">
              {{ props.row.paymentDetail.fromPartyId }}
            </q-td>

            <q-td key="vendorName" style="font-size: 15px">
              {{ props.row.vendorDetails.organizationName }}
            </q-td>
            <q-td key="amount" style="font-size: 15px"
              >{{ props.row.paymentDetail.amount }}
            </q-td>
            <q-td key="status" style="font-size: 15px">
              {{ props.row.paymentDetail.statusId }}
            </q-td>
          </q-tr>
        </template>

        <!-- No data -->
        <template v-slot:no-data>
          <div class="row justify-center full-width">
            <h6>No Data Found</h6>
          </div>
        </template>
      </q-table>

      <div
        class="row justify-center q-ma-md"
        v-if="pagination.rowsNumber <= 0 ? false : true"
      >
        <q-pagination
          v-model="pagination.page"
          :max="Math.ceil(pagination.rowsNumber / pagination.rowsPerPage)"
          max-pages="8"
          direction-links
          color="primary"
          active-color="blue-8"
          active-text-color="white"
          :boundary-numbers="false"
          @update:model-value="(val) => getPayments()"
        />
        <div class="row absolute" style="right: 56px">
          <div class="row justify-center items-center q-pr-md">
            Rows per page of {{ pagination.rowsNumber }} :
          </div>
          <q-select
            dense
            borderless
            style="width: 50px"
            @update:model-value="tableRef.requestServerInteraction()"
            v-model="pagination.rowsPerPage"
            :options="[5, 7, 20, 50, 100, 200, 500]"
          />
        </div>
      </div>

      <!-- invoice info -->
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/useAuthStore";
import { api } from "src/boot/axios";

export default {
  name: "invoiceList_page",

  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const useAuth = useAuthStore();

    // vendor Search section

    const searchOptions = ref([]);
    const search = ref("");

    // filter enum & filter section
    const daysEnumerationsList = ref([]);
    const daysFilterValue = ref("");
    const isDateRangeFilterActive = ref(false);

    const isDaysFilterActive = ref(false);
    const isDateFilterActiveForChip = ref(false);
    const daysFilterSelected = ref("");

    const dateRange = ref({
      fromDate: "",
      toDate: "",
    });
    const correctDateRange = ref({
      fromDate: "",
      thruDate: "",
    });

    const currentTab = ref("allPayment");

    const enumTabList = ref([]);

    // vendor search
    const isVendorFilterActiveForChip = ref(false);
    const vendorFilterSelected = ref({
      name: "",
      partyId: "",
    });

    const isfilterPopActive = ref(null);

    const rows = ref([]);
    const columns = ref([
      {
        name: "date",
        field: " date",
        label: "Date",
        align: "center",
      },
      {
        name: "PaymentDate",
        required: true,
        field: " PaymentDate",
        required: true,
        label: "Payment Date",
        align: "center",
      },
      {
        name: "invoiceId",
        required: true,
        field: " invoiceId",
        required: true,
        label: "Invoice Id",
        align: "center",
      },
      {
        name: "vendorName",
        field: "vendorName",
        label: "Vendor Name",
        align: "center",
      },
      {
        name: "amount",
        field: "amount",
        label: "Amount",
        align: "center",
      },
      {
        name: "status",
        field: " status",
        label: "Status",
        align: "center",
      },
    ]);
    const tableRef = ref(null);
    const pagination = ref({
      sortBy: "column",
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
    });

    // get Invoices List
    function getPayments() {
      var params = {};
      rows.value = [];

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

      // params["pageSize"] = pagination.value.rowsPerPage;
      // params["pageIndex"] = pagination.value.page - 1;
      params["pageSize"] = 50;
      params["pageIndex"] = 0;

      console.log(params);

      api({
        method: "GET",
        headers: useAuth.authKey,
        url: "payments",
        params: params,
      })
        .then((res) => {
          console.log(res);
          rows.value = [];
          res.data.paymentLists.map((data) => {
            rows.value.push(data);
          });
          // pagination.value.rowsNumber = res.data.paymentListCount;
          // pagination.value.page = page;
          // pagination.value.rowsPerPage = rowsPerPage;
          params = {};
        })
        .catch((err) => {
          console.log(err);
        });
    }

    function paymentRedirect(id) {
      router.push({
        name: "paymentInfo_page",
        params: {
          paymentId: id,
        },
      });
    }

    // invoice details
    async function selectVendor(id, name) {
      search.value = "";
      isVendorFilterActiveForChip.value = true;
      vendorFilterSelected.value.name = name;
      vendorFilterSelected.value.partyId = id;
      getPayments();
    }

    function invoiceRedirect(id) {
      if (id) {
        router.push({
          name: "paymentInfo_page",
          params: {
            invoiceId: id,
          },
        });
      }
    }

    // invoice search
    async function searchVendor(val, update) {
      await update(() => {
        if (val != "") {
          api({
            method: "GET",
            url: `vendors?anyField=${val}`,
            headers: useAuth.authKey,
          }).then((res) => {
            searchOptions.value = [];

            res.data.documentList.map((data) => {
              searchOptions.value.push(data);
            });
          });
        } else {
          searchOptions.value = [];
        }
      });
    }

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

    const tabsUpdate = () => {
      getPayments(daysFilterValue.value.enumId);
    };

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

    // date filter section
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
        console.log(daysFilterValue.value.enumId);
        getPayments(daysFilterValue.value.enumId);

        isfilterPopActive.value.hide();
      }
    }

    function applyDateFilter() {
      isDateFilterActiveForChip.value = true;
      correctDateRange.value.fromDate = reverseDate(dateRange.value.fromDate);
      correctDateRange.value.thruDate = reverseDate(dateRange.value.thruDate);

      getPayments();
      isfilterPopActive.value.hide();
    }

    // date converter function
    const reverseDate = (date) => {
      if (date !== null) {
        const part = date.split("-");
        return part[2] + "-" + part[1] + "-" + part[0];
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

    function removeFilter(type) {
      if ((type = "DataFilter")) {
        correctDateRange.value.fromDate = "";
        correctDateRange.value.toDate = "";
        dateRange.value.fromDate = "";
        dateRange.value.toDate = "";
        isDateFilterActiveForChip.value = false;
        daysFilterValue.value = "";
        isDateRangeFilterActive.value = false;
        getPayments();
      }
    }

    onMounted(() => {
      tableRef.value.requestServerInteraction();
      getTabEnumList();
      getDateFilterEnumList();
    });

    return {
      getPayments,
      statusColor,
      searchVendor,

      rows,
      columns,
      paymentRedirect,
      formateTimeStamp,
      tableRef,

      pagination,
      selectVendor,
      dateModifer,

      currentTab,
      enumTabList,
      model: null,
      tabsUpdate,
      searchOptions,
      search,

      invoiceRedirect,

      // filter sections
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
    };
  },
};
</script>

<style></style>
