<template>
  <div class="q-mx-sm q-my-md q-gutter-y-sm q-px-xl">
    <!-- search section  -->
    <div class="column items-center">
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

      <!-- filteers -->
      <div class="row justify-center q-my-sm">
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
              getAccountingList()
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
              getAccountingList(),
              router.replace({ name: 'accountingList_page' })
          "
        />
      </div>
    </div>

    <!-- table Container -->
    <div class="table-container">
      <div style="border: 1px solid #858585; border-radius: 19px">
        <q-table
          ref="tableRef"
          :pagination="pagination"
          @request="(props) => getAccountingList()"
          :rows="rows"
          :columns="columns"
          row-key="name"
          :loading="isLoading"
          separator="horizontal"
          style="border-radius: 20px"
          class="q-py-md"
          flat
          hide-bottom
        >
          <!-- top -->
          <!-- <template v-slot:top>
          <div class="full-width row justify-end">
            <div class="row no-wrap">
              <div class="row content-center q-pr-md">Rows per page :</div>
              <q-select
                style="width: 50px"
                @update:model-value="tableRef.requestServerInteraction()"
                v-model="pagination.rowsPerPage"
                outlined
                filled
                :options="[10, 20, 50, 100, 200, 500]"
              />
            </div>
          </div>
        </template> -->

          <!-- header -->
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                <div style="font-size: 14px" class="text-bold text-primary">
                  {{ col.label }}
                </div>
              </q-th>
            </q-tr>
          </template>

          <!-- body -->
          <template #body="props">
            <q-tr
              :props="props"
              class="text-hover text-center cursor-pointer"
              @click="accountingInfo(props.row.transactionDetail.paymentId)"
              style="height: 80px"
            >
              <!-- date -->
              <q-td key="date">
                <div style="font-size: 16px">
                  {{ dateModifer(props.row.transactionDetail.transactionDate) }}
                </div>
              </q-td>

              <!-- vendor  -->
              <q-td key="vendor">
                <div style="font-size: 16px" class="text-left">
                  {{ props.row.otherParty.organizationName }}<br />
                  {{ props.row.otherParty.emailAddress }}
                </div>
              </q-td>

              <!-- trans id -->
              <q-td key="transectionId">
                <div style="font-size: 16px">
                  #{{ props.row.transactionDetail.acctgTransId }}
                </div>
              </q-td>

              <!-- org name -->
              <q-td key="paymentId">
                <div style="font-size: 16px">
                  {{ props.row.transactionDetail.paymentId }}
                </div>
              </q-td>

              <!-- email -->
              <q-td key="invoiceId">
                <div style="font-size: 16px">
                  {{ props.row.transactionDetail.invoiceId }}
                </div>
              </q-td>

              <!-- contact num -->
              <q-td key="amount">
                <div style="font-size: 16px">
                  $ {{ props.row.transactionDetail.amount }}
                </div>
              </q-td>
            </q-tr>
          </template>

          <!-- no-data -->
          <template v-slot:no-data>NO Data</template>

          <!-- Loading Page -->
          <template v-slot:loading>
            <q-inner-loading showing color="primary" />
          </template>
        </q-table>
      </div>
    </div>

    <!-- pagination -->
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
        @update:model-value="(val) => getAccountingList()"
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
          :options="[5, 10, 20, 50, 100, 200, 500]"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "src/stores/useAuthStore";

export default {
  name: "accountingList_page",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const useAuth = useAuthStore();

    const tableRef = ref(null);
    const isLoading = ref(false);

    const $q = useQuasar();

    // filter section

    // date filter enum section
    const daysEnumerationsList = ref([]);
    const daysFilterValue = ref("");
    const isDateRangeFilterActive = ref(false);

    const isDaysFilterActive = ref(false);
    const isDateFilterActiveForChip = ref(false);
    const daysFilterSelected = ref("");

    const searchOptions = ref([]);
    const search = ref("");

    // vendor filter
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

    const currentTab = ref("allInvoice");

    const enumTabList = ref([]);

    // filter end

    const rows = ref([]);
    const columns = [
      {
        name: "date",
        field: " date",
        label: "DATE",
        align: "center",
      },
      {
        name: "vendor",
        required: true,
        field: "vendor",
        required: true,
        label: "VENDOR",
        align: "left",
      },
      {
        name: "transectionId",
        required: true,
        field: "transectionId",
        required: true,
        label: "TRANSECTION ID",
        align: "center",
      },
      {
        name: "paymentId",
        required: true,
        field: " paymentId",
        required: true,
        label: "PAYMENT ID",
        align: "center",
      },
      {
        name: "invoiceId",
        field: "invoiceId",
        label: "INVOICE ID",
        align: "center",
      },
      {
        name: "amount",
        field: " amount",
        label: "AMOUNT",
        align: "center",
      },
    ];

    const pagination = ref({
      sortBy: "column",
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
    });

    // get vendor
    async function getAccountingList() {
      var params = {};
      rows.value = [];
      isLoading.value = true;

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

      params["pageSize"] = pagination.value.rowsPerPage;
      params["pageIndex"] = pagination.value.page - 1;
      console.log(params);
      await api({
        method: "GET",
        url: "/accounting",
        headers: useAuth.authKey,
        params: params,
      })
        .then((res) => {
          pagination.value.rowsNumber = res.data.acctgTransAndEntryListCount;
          pagination.value.page = pagination.value.page;

          pagination.value.rowsPerPage = pagination.value.rowsPerPage;

          rows.value.push(...res.data.transactionInfoList);
          isLoading.value = false;
        })
        .catch((err) => {
          console.log(err);
          isLoading.value = false;
        });
    }

    // accountingInfo page
    function accountingInfo(id) {
      router.push({
        name: "accountingInfo_page",
        params: {
          paymentId: id,
        },
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

    // filter functionss .......................................

    // invoice search
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

            res.data.documentList.map((data) => {
              searchOptions.value.push(data);
            });

            isLoading.value = false;
          });
        } else {
          searchOptions.value = [];
          isLoading.value = false;
        }
      });
    }

    // select vendor
    async function selectVendor(id, name) {
      await router.replace({
        name: "accountingList_page",
        query: {
          vendorName: name,
          partyId: id,
        },
      });
      search.value = "";
      isVendorFilterActiveForChip.value = true;
      vendorFilterSelected.value.name = name;
      vendorFilterSelected.value.partyId = id;

      getAccountingList();
    }

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

        getAccountingList();

        isfilterPopActive.value.hide();
      }
    }

    const reverseDate = (date) => {
      if (date !== null) {
        const part = date.split("-");
        return part[2] + "-" + part[1] + "-" + part[0];
      }
    };

    function applyDateFilter() {
      isDateFilterActiveForChip.value = true;
      correctDateRange.value.fromDate = reverseDate(dateRange.value.fromDate);
      correctDateRange.value.thruDate = reverseDate(dateRange.value.thruDate);

      getAccountingList();
      isfilterPopActive.value.hide();
    }
    // remove filters
    function removeFilter(type) {
      if ((type = "DataFilter")) {
        correctDateRange.value.fromDate = "";
        correctDateRange.value.toDate = "";
        dateRange.value.fromDate = "";
        dateRange.value.toDate = "";
        isDateFilterActiveForChip.value = false;
        daysFilterValue.value = "";
        isDateRangeFilterActive.value = false;
        getAccountingList();
      }
    }

    // filters fun end ...........................................

    onMounted(() => {
      getDateFilterEnumList();

      if (route.query.partyId) {
        selectVendor(route.query.partyId, route.query.vendorName);
      } else {
        tableRef.value.requestServerInteraction();
      }
    });

    return {
      rows,
      columns,
      tableRef,
      isLoading,
      router,

      model: ref(""),

      accountingInfo,

      // paginationMaxPages
      pagination,
      getAccountingList,
      dateModifer,

      // filters
      daysEnumerationsList,
      daysFilterValue,
      isDateRangeFilterActive,
      isDaysFilterActive,
      isDateFilterActiveForChip,
      daysFilterSelected,
      searchOptions,
      search,
      searchVendor,
      selectVendor,
      isVendorFilterActiveForChip,
      vendorFilterSelected,
      isfilterPopActive,
      dateRange,
      correctDateRange,
      currentTab,
      enumTabList,

      applyDaysFilter,
      applyDateFilter,

      removeFilter,
    };
  },
};
</script>

<style></style>
