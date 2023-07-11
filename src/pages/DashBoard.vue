<template>
  <div class="row" style="background-color: rgb(241, 243, 244)">
    <div class="q-pa-lg row full-width no-wrap">
      <!-- left -->
      <div class="col-9" :class="$q.screen.lt.lg ? 'col-12' : 'col-9'">
        <!-- head -->
        <div
          class="row justify-between q-mx-md q-pa-md"
          style="border-radius: 20px"
        >
          <q-item class="">
            <q-item-section>
              <q-item-label
                class="text-weight-bold text-h4 text-primary"
                style="text-decoration: "
              >
                Dashboard
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-input square outlined rounded style="width: 360px">
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <!-- info cards -->
        <div class="row justify-start full-width q-py-md q-gutter-md">
          <q-card
            style="
              width: 230px;
              background-image: linear-gradient(
                to bottom,
                rgb(154, 153, 221),
                rgb(63, 63, 175)
              );
            "
          >
            <q-card-section class="q-gutter-y-md">
              <div class="row content-center justify-between">
                <div class="row content-center">Total Amount</div>
                <div>
                  <q-btn icon="more_vert" size="10px" flat />
                </div>
              </div>
              <div class="text-h4">$ 14,267</div>
              <div class="text-green">
                +17% Last day
                <q-icon name="north_east" />
              </div>
            </q-card-section>
          </q-card>
          <q-card
            style="
              width: 230px;
              background-image: linear-gradient(
                to right,
                rgb(154, 153, 221),
                rgb(63, 63, 175)
              );
            "
          >
            <q-card-section class="q-gutter-y-md">
              <div class="row content-center justify-between">
                <div class="row content-center">Production Cost</div>
                <div>
                  <q-btn icon="more_vert" size="10px" flat />
                </div>
              </div>
              <div class="text-h4">$ 3268</div>
              <div class="text-red">
                -9% Last Month
                <q-icon name="south_east" />
              </div>
            </q-card-section>
          </q-card>
          <q-card
            style="
              width: 230px;
              background-image: linear-gradient(
                to bottom,
                rgb(154, 153, 221),
                rgb(63, 63, 175)
              );
            "
          >
            <q-card-section class="q-gutter-y-md">
              <div class="row content-center justify-between">
                <div class="row content-center">Paid to Vendors</div>
                <div>
                  <q-btn icon="more_vert" size="10px" flat />
                </div>
              </div>
              <div class="text-h4">$ 8034</div>
              <div class="text-green">27 Invoices</div>
            </q-card-section>
          </q-card>
          <q-card
            style="
              width: 230px;
              background-image: linear-gradient(
                to right,
                rgb(154, 153, 221),
                rgb(63, 63, 175)
              );
            "
          >
            <q-card-section class="q-gutter-y-md">
              <div class="row content-center justify-between">
                <div class="row content-center">Pending Amount</div>
                <div>
                  <q-btn icon="more_vert" size="10px" flat />
                </div>
              </div>
              <div class="text-h4">$ 36,638</div>
              <div class="text-deep-orange-14">41 Invoices</div>
            </q-card-section>
          </q-card>
        </div>

        <!-- graph 1-->

        <div class="row justify- full-width">
          <div class="relative-position">
            <q-tabs
              v-model="invoiceSelected"
              active-color="white bg-primary"
              class="q-mx-md bg-grey-2"
              indicator-color="transparent"
              no-caps
              switch-indicator
              :mobile-arrows="false"
              dense
              outside-arrows
              style="border-radius: 12px; border: 1px solid silver"
              @update:model-value="
                invoiceSelected !== 'custom' ? getFrequencyData() : ''
              "
            >
              <q-tab
                v-for="data in invoiceOptions"
                :key="data"
                :label="data.name"
                :name="data.val"
                style="border-radius: 19px"
              >
              </q-tab>
            </q-tabs>

            <q-tab-panels
              v-if="invoiceSelected == 'custom'"
              v-model="invoiceSelected"
              class="shadow-4 q-pa-sm"
              style="
                position: absolute;
                max-width: 300px;
                height: auto;
                z-index: 1;
                right: 0;
                border-radius: 12px;
              "
            >
              <q-tab-panel name="custom">
                <div class="q-mx-sm q-mb-sm q-gutter-y-sm column items-center">
                  <div class="text-primary">Date Range</div>

                  <!-- get from date -->
                  <q-input
                    v-model="invoiceSelectedCustomeDate.from"
                    outlined
                    mask="##-##-####"
                    dense
                    label="DD-MM-YYYY"
                    readonly
                    hint="From date"
                  >
                    <template v-slot:append>
                      <q-icon
                        name="event"
                        class="cursor-pointer"
                        color="primary"
                      >
                        <q-popup-proxy
                          cover
                          ref="fromDatePopUpRef"
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            mask="DD-MM-YYYY"
                            v-model="invoiceSelectedCustomeDate.from"
                          >
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
                    v-model="invoiceSelectedCustomeDate.to"
                    outlined
                    mask="##-##-####"
                    dense
                    label="DD-MM-YYYY"
                    readonly
                    hint="To Date"
                  >
                    <template v-slot:append>
                      <q-icon
                        name="event"
                        class="cursor-pointer"
                        color="primary"
                      >
                        <q-popup-proxy
                          cover
                          ref="toDatePopUpRef"
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            mask="DD-MM-YYYY"
                            v-model="invoiceSelectedCustomeDate.to"
                          >
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

                  <q-btn
                    @click="getFrequencyData()"
                    label="Apply"
                    color="primary"
                  />
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </div>

          <div class="text-h5 text-weight-bold text-primary">
            Invoice Details
          </div>
        </div>
        <q-separator spaced />
        <div
          class="row justify-between items-center q-gutter-md"
          style="border-radius: 20px"
        >
          <!-- first graph -->
          <q-card class="q-pa-sm">
            <apexchart
              width="650"
              type="bar"
              :options="options"
              :series="options.series"
            />
            <div class="row text-h6 justify-center">Invoice Paid Amount</div>
          </q-card>

          <q-card class="q-pa-sm">
            <apexchart
              width="650"
              type="line"
              :options="options2"
              :series="options2.series"
            />
            <div class="row text-h6 justify-center">Payment Amount</div>
          </q-card>
        </div>

        <!-- graph 2 -->

        <div class="row justify-center full-width q-pt-md">
          <div class="text-h5 text-weight-bold text-primary">
            Payment Details
          </div>
        </div>
        <q-separator spaced />
        <div
          class="row justify-between items-center q-gutter-md"
          style="border-radius: 20px"
        >
          <!-- first graph -->
          <q-card class="q-pa-sm">
            <apexchart
              width="500"
              height="500"
              type="donut"
              :options="pieChart"
              :series="pieChart.series"
            />
            <div class="row text-h6 justify-center">Total Invoice Status</div>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/stores/useAuthStore";
import { onMounted } from "vue";
import { ref } from "vue";

export default {
  name: "dashboard_page",
  components: {
    apexchart: VueApexCharts,
  },
  setup() {
    const useAuth = useAuthStore();

    const invoiceOptions = ref([
      {
        name: "30 Days",
        val: "30",
      },
      {
        name: "60 Days",
        val: "60",
      },
      {
        name: "90 Days",
        val: "90",
      },
      {
        val: "custom",
        name: "Custom Date Range",
      },
    ]);
    const invoiceSelected = ref("30");
    const invoiceSelectedCustomeDate = ref({
      from: "",
      to: "",
    });

    const invoiceChartReady = ref(false);

    function getFrequencyData() {
      const params = {};

      // date filter
      if (invoiceSelected.value !== "custom") {
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - invoiceSelected.value);

        var year = daysAgo.getFullYear();
        var month = String(daysAgo.getMonth() + 1).padStart(2, "0");
        var day = String(daysAgo.getDate()).padStart(2, "0");

        var formattedDate = year + "-" + month + "-" + day;

        params["fromDate"] = formattedDate;
        params["thruDate"] = new Date().toISOString().split("T")[0];
      } else {
        function convertDateFormat(dateString) {
          var parts = dateString.split("-");
          var year = parts[0];
          var month = parts[1];
          var day = parts[2];

          return day + "-" + month + "-" + year;
        }

        params["fromDate"] = convertDateFormat(
          invoiceSelectedCustomeDate.value.from
        );
        params["thruDate"] = convertDateFormat(
          invoiceSelectedCustomeDate.value.to
        );
      }

      params["moduleName"] = "invoice";
      params["frequency"] = "daily";

      console.log(params);

      api({
        method: "GET",
        url: "dashboard/FrequencyWiseData",
        params: params,
        headers: useAuth.authKey,
      }).then((res) => {
        options.value.series[0].data = [];
        res.data.frequencyList.map((data, i) => {
          const obj = {
            x: data.fromDate,
            y: i * 2,
          };
          options.value.series[0].data.push(obj);
        });
      });
    }

    const options = ref({
      series: [
        {
          name: "Invoices",
          data: [],
        },
      ],

      xaxis: {
        type: "Date",
        labels: {
          formatter: (val) => {
            console.log(val);
            //   const daysText = `${data.fromDate.split("-")[2]} - ${
            //   data.fromDate.split("-")[1]
            // }`;
            return val;
          },
        },
      },
      title: {
        text: "Invoice",
      },
      tooltip: {
        x: {
          formatter: (val) => {
            return val;
          },
        },
      },
    });

    const options2 = {
      series: [
        {
          name: "series1",
          data: [1, 434, 4334, 454, 543, 5354],
          color: "#3f3faf",
        },
      ],

      chart: {
        height: 350,
        type: "area",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },

      // xaxis: {
      //   type: "datetime",
      // },
      labels: [1, 2, 3, 4, 5, "last"],
    };

    const pieChart = {
      series: [44, 55, 41, 17, 15],
      labels: ["Paid ", "Approved ", "UnPaid", "Cancelled", "Refunded"],
      chart: {
        type: "donut",
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    };

    onMounted(() => {
      getFrequencyData();
    });

    return {
      options,
      options2,
      pieChart,

      getFrequencyData,

      invoiceSelected,
      invoiceOptions,
      invoiceChartReady,
      invoiceSelectedCustomeDate,
    };
  },
};
</script>
