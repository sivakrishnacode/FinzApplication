<template>
  <div class="q-mx-sm q-my-md q-gutter-y-md q-px-xl">
    <!-- search and add btn -->
    <div class="row justify-center q-gutter-x-md no-wrap">
      <q-select
        dense
        outlined
        rounded
        v-model="model"
        use-input
        fill-input
        option-label="organizationName"
        option-value="partyId"
        :options="searchOptions"
        @filter="searchFun"
        :style="$q.screen.lt.sm ? { width: '350px' } : { width: '450px' }"
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
                @click="vendorInfo(scope.opt.partyId)"
              >
                <q-item-label>{{ scope.opt.organizationName }}</q-item-label>
                <q-item-label caption>{{ scope.opt.partyId }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </template>
      </q-select>

      <!-- date filter btn btn -->
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

    <!-- table Container -->
    <div class="table-container">
      <q-table
        ref="tableRef"
        :rows="rows"
        :columns="columns"
        row-key="name"
        :loading="isLoading"
        @request="(props) => getVendors(props)"
        separator="horizontal"
        style="border-radius: 12px"
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
          <q-tr
            :props="props"
            class="text-weight-bold text-primary bg-secondary"
          >
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
            @click="vendorInfo(props.row.partyId)"
            style="border: 2px solid gray"
          >
            <!-- profile -->
            <q-td key="profile">
              <q-avatar class="bg-primary text-white" size="lg">
                <div>
                  {{ firstLetters(props.row.organizationName).toUpperCase() }}
                </div>
              </q-avatar>
            </q-td>

            <!-- org name -->
            <q-td key="organizationname">
              <div style="font-size: 15px">
                {{ props.row.organizationName }}
              </div>
            </q-td>

            <!-- email -->
            <q-td key="email">
              <div style="font-size: 15px">
                {{
                  props.row.contactMechs.find(
                    (val) => val.contactMechTypeEnumId == "CmtEmailAddress"
                  ).infoString
                }}
              </div>
            </q-td>

            <!-- contact num -->
            <q-td key="contactNumber">
              <div style="font-size: 15px">
                +91
                {{
                  props.row.contactMechs.find(
                    (val) => val.contactMechTypeEnumId == "CmtTelecomNumber"
                  ).contactNumber
                }}
              </div>
            </q-td>

            <q-td key="location">
              <div style="font-size: 15px">
                {{
                  props.row.contactMechs.find(
                    (val) => val.contactMechTypeEnumId == "CmtPostalAddress"
                  ).city
                }}
              </div>
            </q-td>

            <!-- status -->
            <q-td key="status">
              <q-chip
                :class="props.row.disabled === 'N' ? 'text-green' : 'text-red'"
              >
                <q-badge
                  rounded
                  :color="props.row.disabled === 'N' ? 'green' : 'red'"
                  class="q-mr-sm"
                />
                {{ props.row.disabled === "N" ? "Active" : "In Active" }}
              </q-chip>
            </q-td>

            <q-td key="more">
              <q-btn
                round
                flat
                class="text-dark"
                icon="more_vert"
                @click="
                  (e) => {
                    e.stopPropagation();
                  }
                "
              >
                <q-menu anchor="center left" self="center end">
                  <q-item
                    clickable
                    v-ripple
                    @click="vendorInfo(props.row.partyId)"
                  >
                    <q-item-section avatar>
                      <q-icon name="visibility" />
                    </q-item-section>

                    <q-item-section>View Profile</q-item-section>
                  </q-item>

                  <q-item clickable v-ripple>
                    <q-item-section avatar>
                      <q-icon name="receipt_long" />
                    </q-item-section>

                    <q-item-section>Invoice</q-item-section>
                  </q-item>

                  <q-item clickable v-ripple>
                    <q-item-section avatar>
                      <q-icon name="account_balance" />
                    </q-item-section>

                    <q-item-section>Accounting</q-item-section>
                  </q-item>

                  <q-item clickable v-ripple>
                    <q-item-section avatar>
                      <q-icon name="payments" />
                    </q-item-section>

                    <q-item-section>Payments</q-item-section>
                  </q-item>
                </q-menu>
              </q-btn>
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
</template>

<script>
import { onMounted, ref, computed } from "vue";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/useAuthStore";

export default {
  name: "vendorsList_page",
  setup() {
    const router = useRouter();
    const useAuth = useAuthStore();

    const tableRef = ref(null);
    const isLoading = ref(false);

    const $q = useQuasar();

    const moreBtn = ref(false);

    // date filter enum section
    const daysEnumerationsList = ref([]);
    const daysFilterValue = ref("");
    const isDateRangeFilterActive = ref(false);

    const isDaysFilterActive = ref(false);
    const isDateFilterActiveForChip = ref(false);
    const daysFilterSelected = ref("");
    const isfilterPopActive = ref(null);

    const dateRange = ref({
      fromDate: "",
      toDate: "",
    });
    const correctDateRange = ref({
      fromDate: "",
      thruDate: "",
    });

    const rows = ref([]);
    const columns = [
      {
        name: "profile",
        required: true,
        field: " ",
        required: true,
        label: "Profile",
        align: "center",
        style: "color: red",
      },
      {
        name: "organizationName",
        required: true,
        field: " ",
        required: true,
        label: "Organization Name",
        align: "center",
      },
      { name: "email", field: "emailAddress", align: "center", label: "Email" },
      {
        name: "number",
        field: "contactNumber",
        label: "Contact No",
        align: "center",
      },
      {
        name: "location",
        field: "location",
        label: "Location",
        align: "center",
      },
      {
        name: "status",
        field: "status",
        label: "Status",
        align: "center",
      },
      {
        name: "more",
        field: "more",
        label: "More",
        align: "center",
      },
    ];

    const searchOptions = ref([]);

    // const pagination = ref({
    //   sortBy: "column",
    //   descending: false,
    //   page: 1,
    //   rowsPerPage: 5,
    //   rowsNumber: 0,
    // });

    // get vendor
    function getAccountingList() {
      isLoading.value = true;
      rows.value = [];
      api({
        method: "GET",
        url: "/accounting",
        headers: useAuth.authKey,
      })
        .then((res) => {
          console.log(res.data);

          rows.value.push(...res.data.entryLists);
          isLoading.value = false;
        })
        .catch((err) => {
          console.log(err);
          isLoading.value = false;
        });
    }

    //first letter of a world
    function firstLetters(str) {
      let words = str.split(" ");
      let firstLetter1 = words[0].charAt(0).toUpperCase();
      let firstLetter2 = words.length > 1 ? words[1].charAt(0) : "";
      return firstLetter1 + firstLetter2;
    }

    // search vendor
    async function searchFun(val, update) {
      console.log(val);
      isLoading.value = true;

      await update(() => {
        if (val != "") {
          api({
            method: "GET",
            url: `vendors?anyField=${val}`,
            headers: useAuth.authKey,
          }).then((res) => {
            searchOptions.value = [];

            console.log(res.data.documentList);

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

    // edit vendor
    function vendorInfo(id) {
      router.push({
        name: "vendorInfo_page",
        params: {
          vendorId: id,
        },
      });
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
        console.log(daysFilterValue.value.enumId);

        isfilterPopActive.value.hide();
      }
    }

    function applyDateFilter() {
      isDateFilterActiveForChip.value = true;
      correctDateRange.value.fromDate = reverseDate(dateRange.value.fromDate);
      correctDateRange.value.thruDate = reverseDate(dateRange.value.thruDate);

      isfilterPopActive.value.hide();
    }

    const reverseDate = (date) => {
      if (date !== null) {
        const part = date.split("-");
        return part[2] + "-" + part[1] + "-" + part[0];
      }
    };

    onMounted(() => {
      getDateFilterEnumList();
      getAccountingList();
    });

    return {
      rows,
      columns,
      moreBtn,

      firstLetters,

      searchFun,
      vendorInfo,

      tableRef,
      isLoading,
      searchOptions,
      model: ref(""),

      // paginationMaxPages

      // filter section
      daysEnumerationsList,
      daysFilterValue,
      isDateRangeFilterActive,
      isDaysFilterActive,
      isDateFilterActiveForChip,
      daysFilterSelected,
      applyDateFilter,
      applyDaysFilter,
      isfilterPopActive,
      dateRange,
      correctDateRange,
      reverseDate,
    };
  },
};
</script>

<style></style>
