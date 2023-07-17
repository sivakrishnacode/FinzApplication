<template>
  <div class="q-mx-sm q-my-md q-gutter-y-md q-px-xl">
    <!-- search and add btn -->
    <div class="row justify-center q-gutter-x-md no-wrap">
      <q-input
        dense
        outlined
        rounded
        v-model="searchInput"
        placeholder="Search"
        @update:model-value="getVendors({ pagination })"
        :style="$q.screen.lt.sm ? { width: '300px' } : { width: '400px' }"
      >
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>

      <!-- upload btn -->

      <div class="row absolute" style="right: 56px; top: 78px">
        <!-- add vendor btn -->
        <q-btn
          flat
          no-wrap
          no-caps
          :label="$q.screen.lt.sm ? '' : 'Create Vendor'"
          icon="add"
          @click="$router.push({ name: 'createVendor_page' })"
          :round="$q.screen.lt.sm ? true : false"
          class="bg-primary text-white text3"
          rounded
        >
        </q-btn>
      </div>
    </div>

    <!-- <q-separator /> -->

    <!-- table Container -->
    <div class="table-container">
      <div style="border: 1px solid #858585; border-radius: 19px">
        <q-table
          ref="tableRef"
          :rows="rows"
          :columns="columns"
          row-key="name"
          v-model:pagination="pagination"
          :loading="isLoading"
          @request="(props) => getVendors(props)"
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
              @click="vendorInfo(props.row.partyId)"
              style="border: 2px solid gray; height: 80px"
            >
              <!-- profile -->
              <q-td key="profile">
                <q-avatar class="bg-primary text-white" size="xl">
                  <div>
                    {{ firstLetters(props.row.organizationName).toUpperCase() }}
                  </div>
                </q-avatar>
              </q-td>

              <!-- org name -->
              <q-td key="organizationname" class="text-left">
                <span style="font-size: 16px">
                  {{ props.row.organizationName }}
                </span>
              </q-td>

              <!-- email -->
              <q-td key="email" class="text-left">
                <span style="font-size: 16px">
                  {{
                    props.row.contactMechs.find(
                      (val) => val.contactMechTypeEnumId == "CmtEmailAddress"
                    )?.infoString
                  }}
                </span>
              </q-td>

              <!-- contact num -->
              <q-td key="contactNumber" class="text-left">
                <span style="font-size: 16px">
                  +91
                  {{
                    props.row.contactMechs.find(
                      (val) => val.contactMechTypeEnumId == "CmtTelecomNumber"
                    )?.contactNumber
                  }}
                </span>
              </q-td>

              <q-td key="location" class="text-left">
                <span style="font-size: 16px">
                  {{
                    props.row.contactMechs.find(
                      (val) => val.contactMechTypeEnumId == "CmtPostalAddress"
                    )?.city
                  }}
                </span>
              </q-td>

              <!-- status -->
              <q-td key="status">
                <q-chip
                  :class="
                    props.row.disabled === 'N' ? 'text-green' : 'text-red'
                  "
                >
                  <q-badge
                    rounded
                    :color="props.row.disabled === 'N' ? 'green' : 'red'"
                    class="q-mr-sm"
                  />
                  {{ props.row.disabled === "N" ? "Active" : "In Active" }}
                </q-chip>
              </q-td>

              <!-- more -->
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

                    <q-item
                      clickable
                      v-ripple
                      @click="
                        router.push({
                          name: 'invoiceList_page',
                          query: {
                            vendorName: props.row.organizationName,
                            partyId: props.row.partyId,
                          },
                        })
                      "
                    >
                      <q-item-section avatar>
                        <q-icon name="receipt_long" />
                      </q-item-section>

                      <q-item-section>Invoice</q-item-section>
                    </q-item>

                    <q-item
                      clickable
                      v-ripple
                      @click="
                        router.push({
                          name: 'paymentList_page',
                          query: {
                            vendorName: props.row.organizationName,
                            partyId: props.row.partyId,
                          },
                        })
                      "
                    >
                      <q-item-section avatar>
                        <q-icon name="payments" />
                      </q-item-section>

                      <q-item-section>Payments</q-item-section>
                    </q-item>

                    <q-item
                      clickable
                      v-ripple
                      @click="
                        router.push({
                          name: 'accountingList_page',
                          query: {
                            vendorName: props.row.organizationName,
                            partyId: props.row.partyId,
                          },
                        })
                      "
                    >
                      <q-item-section avatar>
                        <q-icon name="account_balance" />
                      </q-item-section>

                      <q-item-section>Accounting</q-item-section>
                    </q-item>
                  </q-menu>
                </q-btn>
              </q-td>
            </q-tr>
          </template>

          <!-- no-data -->
          <template v-slot:no-data> <h1>NO Data</h1></template>

          <!-- Loading Page -->
          <template v-slot:loading>
            <q-inner-loading showing color="primary" />
          </template>
        </q-table>
      </div>

      <!-- paginatio btn -->
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
          @update:model-value="
            (val) =>
              getVendors({
                pagination: { page: val, rowsPerPage: pagination.rowsPerPage },
              })
          "
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
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
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

    const rows = ref([]);
    const columns = [
      {
        name: "profile",
        required: true,
        field: " ",
        required: true,
        label: "PROFILE",
        align: "center",
        style: "color: red",
      },
      {
        name: "organizationName",
        required: true,
        field: " ",
        required: true,
        label: "ORGANIZATION NAME",
        align: "left",
      },
      {
        name: "email",
        field: "emailAddress",
        align: "left",
        label: "EMAILADDRESS",
      },
      {
        name: "number",
        field: "contactNumber",
        label: "CONTACT NUMBER",
        align: "left",
      },
      {
        name: "location",
        field: "location",
        label: "LOCATION",
        align: "left",
      },
      {
        name: "status",
        field: "status",
        label: "STATUS",
        align: "center",
      },
      {
        name: "more",
        field: "more",
        label: "MORE",
        align: "center",
      },
    ];

    const newVendorDetails = ref({
      vendorName: "",
      contactNumber: "",
      emailAddress: "",
      address1: "",
      address2: "",
      city: "",
      countryGeoId: "",
      stateProvinceGeoId: "",
      postalCode: "",
      partyId: "",
    });

    const searchInput = ref("");

    const pagination = ref({
      sortBy: "column",
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
    });

    // get vendor
    function getVendors(props) {
      rows.value = [];
      isLoading.value = true;
      const { page, rowsPerPage } = props.pagination;

      const params = {};
      params["pageIndex"] = page - 1;
      params["pageSize"] = rowsPerPage;
      params["pageNoLimit"] = false;

      if (searchInput.value !== "") {
        params["anyField"] = searchInput.value;
      }

      api({
        method: "GET",
        url: "vendors",
        headers: useAuth.authKey,
        params: params,
      })
        .then((res) => {
          const vendorsList = res.data.documentList;
          pagination.value.rowsNumber = res.data.documentListCount;

          rows.value.push(...res.data.documentList);

          pagination.value.page = page;
          pagination.value.rowsPerPage = rowsPerPage;
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

    // edit vendor
    function vendorInfo(id) {
      router.push({
        name: "vendorInfo_page",
        params: { vendorId: id },
        query: { name: "sivaa" },
      });
    }

    onMounted(() => {
      tableRef.value.requestServerInteraction();
    });

    return {
      rows,
      columns,
      moreBtn,

      firstLetters,
      newVendorDetails,
      pagination,
      getVendors,
      searchInput,

      vendorInfo,
      router,

      tableRef,
      isLoading,

      model: ref(""),

      // paginationMaxPages
    };
  },
};
</script>

<style></style>
