<template>
  <div class="row no-wrap">
    <!-- Side list -->
    <div
      class="q-gutter-y-sm q-pa-lg"
      style="width: 400px"
      v-if="!$q.screen.lt.md"
    >
      <q-input
        rounded
        outlined
        label="Search"
        v-model="search"
        @update:model-value="(val) => searchInput(val)"
        dense
        clearable
      >
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>

      <!-- upload invoice btn -->
      <div class="full-width">
        <q-btn
          rounded
          class="full-width"
          color="primary"
          label="Upload Invoice"
          no-caps
          icon="upload"
          no-wrap
          style="height: 20px"
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

      <!-- tabs -->
      <div>
        <q-tabs
          v-model="currentTab"
          active-color="white bg-primary"
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
            style="border-radius: 19px"
          />
        </q-tabs>
      </div>

      <q-scroll-area
        class="q-pa-sm"
        style="border: 1px solid gray; border-radius: 10px; height: 650px"
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
      </q-scroll-area>
    </div>

    <!-- Invoice Info side -->
    <div class="row justify-center full-width">
      <div class="row full-width">
        <!-- center body -->
        <div
          class="row justify-center bg-red"
          :class="$q.screen.lt.lg ? 'col-12' : 'col-8'"
        >
          <div style="width: 80%">
            <!-- title -->
            <div class="q-px-xl">
              <div
                class="bg-secondary text-center full-width"
                style="border-radius: 0 0 70px 70px"
              >
                <div class="text-primary text-h6 q-pa-sm">
                  {{ invoiceDetail.fromParty?.organization.organizationName }}
                </div>
                <div class="text-blue-grey-1 q-pb-sm">
                  {{ invoiceDetail.invoiceId }}
                </div>
                <!-- cancel btn -->
                <!-- <div class="row absolute" style="top: 59px">
                  <div
                    class="bg-info"
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
                </div> -->
              </div>
            </div>

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
                      <q-item-label
                        class="text-h6"
                        :class="
                          'text-' +
                          statusColor(invoiceDetail.status?.statusId)?.color
                        "
                      >
                        {{ invoiceDetail.status?.description }}
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
                <div class="full-width q-pa-sm">
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
                      {{ (data.amount / data.quantity).toFixed() }}
                    </q-item-section>
                    <q-item-section
                      class="col-2 text-weight-bold row content-center"
                    >
                      {{ data.quantity }}
                    </q-item-section>
                    <q-item-section
                      class="col-2 text-weight-bold row content-center"
                    >
                      {{ data.amount }}
                    </q-item-section>
                  </q-item>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- right side -->
        <div
          class="row justify-center q-mt-md bg-yellow"
          :class="$q.screen.lt.lg ? 'col-12' : 'col-4'"
        >
          <div style="width: 80%" class="q-gutter-y-md">
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
                    {{
                      invoiceDetail.invoiceTotal - invoiceDetail.unpaidTotal
                    }}</q-item-label
                  >
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

            <!-- HISTORY -->
            <div class="bg-secondary q-pa-lg" style="border-radius: 13px">
              <div class="text-h5 q-pa-md" style="text-decoration: underline">
                Invoice History:
              </div>
              <q-item class="q-my-sm">
                <q-item-section>
                  <q-item-label>Date : 02-12-2023</q-item-label>
                  <q-item-label overline>Time : 06:54 PM</q-item-label>
                </q-item-section>

                <q-item-section avatar>
                  <q-item-label class="text-h6 text-green"
                    >Approved</q-item-label
                  >
                  <q-item-label overline>By User1</q-item-label>
                </q-item-section>
              </q-item>

              <q-item class="q-my-sm">
                <q-item-section>
                  <q-item-label>Date : 02-12-2023</q-item-label>
                  <q-item-label overline>Time : 06:54 PM</q-item-label>
                </q-item-section>

                <q-item-section avatar>
                  <q-item-label class="text-h6 text-green"
                    >Approved</q-item-label
                  >
                  <q-item-label overline>By User1</q-item-label>
                </q-item-section>
              </q-item>
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
    const enumTabList = ref([]);
    const currentTab = ref("allInvoice");
    const invoiceList = ref([]);
    const search = ref("");

    // invoice info items
    const invoiceDetail = ref("");
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
      invoiceList.value = [];
      api({
        method: "GET",
        headers: useAuth.authKey,
        url: "invoices",
        params: {
          statusId: currentTab.value,
          pageIndex: 0,
          pageSize: 100,
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

    function searchInput(val) {
      console.log(val);
      if (val == "" || val == null) {
        getInvoiceList();
      } else {
        var result = invoiceList.value.filter((person) =>
          person.organizationName.toLowerCase().includes(val.toLowerCase())
        );
        invoiceList.value = result;
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

    //  file upload

    function invoiceFileUpload() {
      console.log(invoiceFile.value.name);

      invoiceFileType.value = invoiceFile.value.type;
      invoiceFileName.value = invoiceFile.value.name;

      tempFileUrl.value = URL.createObjectURL(invoiceFile.value);

      nextTick(() => {
        var adobeDCView = new AdobeDC.View({
          clientId: "2dca231a9daf4cba8ee969c8274088eb",
          divId: "pdf-viewer",
        });
        console.log(tempFileUrl.value);

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
          console.log(res);
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

    onMounted(() => {
      getInvoiceDetails(route.params.invoiceId);
      getTabEnumList();
      getInvoiceList();
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
      invoiceList,
      enumTabList,
      getInvoiceList,
      currentTab,
      getInvoiceDetails,
      search,
      searchInput,

      // invoice info side
      invoiceDetail,
      toStatusFlow,
      changeInvoiceStatus,
      statusColor,
      router,
    };
  },
};
</script>

<style></style>
