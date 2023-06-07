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
        <!-- <q-btn
          color="primary"
          icon="add"
          label="Upload Invoice"
          @click="selectFile"
        /> -->
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
          @update:model-value="getInvoiceList(daysFilterValue.enumId)"
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

      <q-dialog v-model="previewDialog">
        <!-- For Img -->
        <q-card v-if="isFileImage" :persistent="isUploading">
          <q-item class="row justify-between">
            <q-item-label>{{ invoiceFile.name }}</q-item-label>
            <q-btn
              icon="close"
              color="primary"
              dense
              round
              flat
              @click="closePreview"
            />
          </q-item>
          <q-separator />
          <q-item class="full-height">
            <q-img :src="tempImageUrl"></q-img>
          </q-item>

          <q-separator />

          <q-item class="row justify-center">
            <q-btn label="Upload" color="primary" rounded no-caps>
              <template #loading>
                <q-spinner color="white" size="1em" />
              </template>
            </q-btn>
          </q-item>
        </q-card>

        <!-- For Pdf -->
        <q-card
          v-if="!isFileImage"
          style="width: 500px"
          :persistent="isUploading"
        >
          <q-item class="row justify-between">
            <div class="text-primary text-weight-bold">
              {{ invoiceFile.name }}
            </div>
            <q-btn
              icon="close"
              color="primary"
              dense
              round
              flat
              @click="closePreview"
            />
          </q-item>

          <q-separator />

          <pdf :src="tempFileUrl"></pdf>

          <q-separator />

          <q-item class="row justify-center">
            <q-btn
              label="Upload"
              color="primary"
              rounded
              no-caps
              @click="fileUploadHandler"
            >
              <template #loading>
                <q-spinner color="white" size="1em" />
              </template>
            </q-btn>
          </q-item>
        </q-card>
      </q-dialog>
    </div>

    <!-- Preview box -->

    <!-- filter preview chip -->
    <div class="row content-center">
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
            getInvoiceList()
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
          ((vendorFilterSelected.partyId = ''), (search = '')), getInvoiceList()
        "
      />
    </div>

    <q-separator spaced />

    <!-- Table -->
    <div class="table-container">
      <q-table
        :rows="rows"
        :columns="columns"
        separator="horizontal"
        class="q-py-md"
        flat
        hide-bottom
      >
        <q-separator />

        <!-- header -->
        <template v-slot:header="props">
          <q-tr :props="props" class="text-weight-bold text-h5 bg-blue-grey-1">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <!-- body -->
        <template #body="props">
          <q-tr
            :props="props"
            class="text-center cursor-pointer"
            @click="invoiceRedirect(props.row.invoiceId)"
          >
            <q-td key="Invoice_date">
              {{ dateModifer(props.row.invoiceDate) }}
            </q-td>

            <q-td key="Vendor">
              {{ props.row.organizationName }}
            </q-td>

            <q-td key="Email"> Email not reseaved from server </q-td>

            <q-td key="Amount">
              {{
                props.row.invoiceTotal.toLocaleString("en-US", {
                  style: "currency",
                  currency: props.row.currencyUomId,
                })
              }}
            </q-td>

            <q-td key="Due_Date">{{
              props.row.unpaidTotal.toLocaleString("en-US", {
                style: "currency",
                currency: props.row.currencyUomId,
              })
            }}</q-td>
            <q-td key="Status">
              <q-chip :class="'text-' + statusColor(props.row.statusId)">
                <q-badge
                  rounded
                  :color="statusColor(props.row.statusId)"
                  class="q-mr-sm"
                />
                {{ props.row.statusId }}
              </q-chip>
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

import pdf from "pdfvuer";

export default {
  name: "invoiceList_page",
  components: {
    pdf,
  },

  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const useAuth = useAuthStore();

    // upload section
    const invoiceFile = ref(null);
    const invoiceFileType = ref(null);
    const invoiceFileName = ref(null);

    const previewDialog = ref(false);
    const approveConfirmDailog = ref(false);
    const cancelConfirmDailog = ref(false);

    const isFileImage = ref(false);
    const fileInputRef = ref(null);
    const isUploading = ref(false);
    const tempFileUrl = ref("");

    const isLoading = ref(false);
    const searchOptions = ref([]);
    const search = ref("");

    // date filter enum section
    const daysEnumerationsList = ref([]);
    const daysFilterValue = ref("");
    const isDateRangeFilterActive = ref(false);

    const isDaysFilterActive = ref(false);
    const isDateFilterActiveForChip = ref(false);
    const daysFilterSelected = ref("");

    // vendor search
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

    const invoiceInfoData = ref(null);

    const rows = ref([]);
    const columns = ref([
      {
        name: "Invoice_date",
        required: true,
        field: " Invoice_date",
        required: true,
        label: "Invoice Date",
        align: "center",
      },
      {
        name: "Vendor",
        required: true,
        field: " Vendor",
        required: true,
        label: "Vendor Name",
        align: "center",
      },
      {
        name: "Email",
        field: "Email",
        label: "Email Address",
        align: "center",
      },
      {
        name: "Amount",
        field: " Amount",
        label: "Amount",
        align: "center",
      },
      {
        name: "UnPaidAmount",
        field: " UnPaidAmount",
        label: "UnPaid Amount",
        align: "center",
      },

      {
        name: "Status",
        required: true,
        field: " Status",
        required: true,
        label: "Status",
        align: "center",
      },
    ]);
    const pagination = ref({
      rowsPerPage: 10,
    });

    const currentTab = ref("allInvoice");
    const invoiceInfoTab = ref(false);
    const enumTabList = ref([]);

    // get Invoices List
    function getInvoiceList() {
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

      console.log(params);

      api({
        method: "GET",
        headers: useAuth.authKey,
        url: "invoices",
        params: params,
      })
        .then((res) => {
          rows.value = [];
          res.data.invoiceList.map((data) => {
            rows.value.push(data);
          });
          params = {};
        })
        .catch((err) => {
          console.log(err);
        });
    }

    // invoice details
    async function selectVendor(id, name) {
      search.value = "";
      isVendorFilterActiveForChip.value = true;
      vendorFilterSelected.value.name = name;
      vendorFilterSelected.value.partyId = id;

      getInvoiceList();

      // invoiceInfoTab.value = false;
      // invoiceInfoData.value = "";
      // console.log(id);

      // if (id == null) {
      //   id = 100561;
      // }

      // await api({
      //   method: "GET",
      //   headers: useAuth.authKey,
      //   url: `invoices/${id}`,
      // })
      //   .then((res) => {
      //     invoiceInfoData.value = res.data;
      //   })
      //   .finally(() => {
      //     invoiceInfoTab.value = true;
      //   });
    }

    function invoiceRedirect(id) {
      if (id) {
        router.push({
          name: "invoiceInfo_page",
          params: {
            invoiceId: id,
          },
        });
      }
    }

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

    function invoiceFileUpload() {
      console.log(invoiceFile.value.name);

      invoiceFileType.value = invoiceFile.value.type;
      invoiceFileName.value = invoiceFile.value.name;

      tempFileUrl.value = URL.createObjectURL(invoiceFile.value);

      if (invoiceFileType.value.includes("image/")) {
        previewDialog.value = true;
        isFileImage.value = true;
      } else {
        previewDialog.value = true;
        isFileImage.value = false;
      }
    }

    const fileUploadHandler = () => {
      console.log("clicked");

      var formData = new FormData();
      formData.append("wikiSpaceId", "Invoices");
      formData.append("attachmentFile", invoiceFile.value);

      isUploading.value = true;

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
          console.log(res);
          isUploading.value = false;
          previewDialog.value = false;
          $q.notify({
            position: "top-right",
            message: "Invoice Uploaded Succesfully",
            type: "positive",
            icon: "done",
          });
        })
        .catch((err) => {
          console.log(err);
          $q.notify({
            position: "top-right",
            message: err.response.data.errors,
            type: "negative",
            icon: "cancel",
          });
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

    const tabsUpdate = () => {
      getInvoiceList(daysFilterValue.value.enumId);
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
        getInvoiceList(daysFilterValue.value.enumId);

        isfilterPopActive.value.hide();
      }
    }

    function applyDateFilter() {
      isDateFilterActiveForChip.value = true;
      correctDateRange.value.fromDate = reverseDate(dateRange.value.fromDate);
      correctDateRange.value.thruDate = reverseDate(dateRange.value.thruDate);

      getInvoiceList();
      isfilterPopActive.value.hide();
    }

    // date converter function
    const reverseDate = (date) => {
      if (date !== null) {
        const part = date.split("-");
        return part[2] + "-" + part[1] + "-" + part[0];
      }
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
        getInvoiceList();
      }
    }

    onMounted(() => {
      getInvoiceList();
      getTabEnumList();
      getDateFilterEnumList();
    });

    // <q-file
    //       v-model="invoiceFile"
    //       type="file"
    //       label="Upload Invoice"
    //       ref="fileInputRef"
    //       rounded
    //       outlined
    //       style="opacity: 0; position: absolute; max-width: 1px"
    //       @update:model-value="invoiceFileUpload"
    //     >
    //       <template #append>
    //         <q-icon name="backup" />
    //       </template>
    //     </q-file>

    return {
      getInvoiceList,
      statusColor,
      searchVendor,
      invoiceFile,
      invoiceFileUpload,
      invoiceFileType,
      isFileImage,
      closePreview,
      previewDialog,
      approveConfirmDailog,
      cancelConfirmDailog,
      tempFileUrl,
      fileUploadHandler,
      isUploading,
      rows,
      columns,
      invoiceInfoData,
      pagination,
      selectVendor,
      dateModifer,
      fileInputRef,
      selectFile,
      currentTab,
      enumTabList,
      model: null,
      tabsUpdate,
      searchOptions,
      search,
      isLoading,
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

      // invoice info tab
      invoiceInfoTab,
    };
  },
};
</script>

<style></style>
