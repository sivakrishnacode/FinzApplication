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

          <q-input square outlined rounded v-model="text" style="width: 360px">
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

        <div class="row justify-center full-width">
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
              :options="options3"
              :series="options3.series"
            />
            <div class="row text-h6 justify-center">Total Invoice Status</div>
          </q-card>

          <q-card class="q-pa-sm">
            <apexchart
              width="800"
              type="bar"
              :options="options2"
              :series="options2.series"
            />
            <div class="row text-h6 justify-center">Payment Amount</div>
          </q-card>
        </div>
      </div>

      <!-- right -->

      <div
        class="col-3 q-gutter-y-sm q-px-md"
        v-if="!$q.screen.lt.lg"
        style="width: 450px"
      >
        <!-- Search bar -->
        <div class="text-h5 text-weight-bold text-primary">
          Recent Transection
          <q-icon name="trending_up" />
        </div>

        <q-separator />

        <q-scroll-area class="fit">
          <!-- List -->
          <q-list class="q-gutter-sm">
            <q-item
              v-for="data in 20"
              :key="data"
              active-class="bg-blue"
              clickable
              v-ripple
              class="bg-secondary text-primary"
              style="border-radius: 5px"
            >
              <!-- avator -->
              <q-item-section avatar>
                <q-avatar text-color="yellow">
                  <q-icon name="star" />
                </q-avatar>
              </q-item-section>

              <!-- name -->
              <q-item-section>
                <q-item-label> To SumithraDevi </q-item-label>
                <q-item-label class="text-white text-caption">
                  sumithrasd13@gmail.com
                </q-item-label>
              </q-item-section>

              <q-item-section class="row justify-end" avatar>
                <q-item-label class="text-primary"> USD 7865 </q-item-label>
                <q-item-label class="text-white text-caption">
                  June 15, 2022
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </div>
    </div>
  </div>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";

export default {
  name: "dashboard_page",
  components: {
    apexchart: VueApexCharts,
  },
  setup() {
    const options = {
      series: [
        {
          name: "Paid Invoices",
          type: "column",
          color: "#9a99dd",

          data: [230, 130, 320, 390, 200, 150, 80, 120, 600, 120, 180, 90],
        },
        {
          name: "Total Invoices",
          type: "column",
          color: "#3f3faf",
          data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160],
        },
      ],

      chart: {
        height: 350,
        type: "line",
      },
      stroke: {
        width: [0, 0],
      },

      dataLabels: {
        enabled: false,
        enabledOnSeries: [0],
      },
      labels: [
        "01 Jan 2001",
        "02 Jan 2001",
        "03 Jan 2001",
        "04 Jan 2001",
        "05 Jan 2001",
        "06 Jan 2001",
        "07 Jan 2001",
        "08 Jan 2001",
        "09 Jan 2001",
        "10 Jan 2001",
        "11 Jan 2001",
        "12 Jan 2001",
      ],
      xaxis: {
        type: "datetime",
      },
      yaxis: [
        {
          title: {
            text: "No of Invoice",
          },
        },
      ],
    };

    const options2 = {
      series: [
        {
          name: "series1",
          data: [42, 39, 28, 51, 42, 109, 100, 45, 87, 72, 43, 65],
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

      xaxis: {
        type: "datetime",
      },
      labels: [
        "01 Jan 2001",
        "02 Jan 2001",
        "03 Jan 2001",
        "04 Jan 2001",
        "05 Jan 2001",
        "06 Jan 2001",
        "07 Jan 2001",
        "08 Jan 2001",
        "09 Jan 2001",
        "10 Jan 2001",
        "11 Jan 2001",
        "12 Jan 2001",
      ],
    };

    const options3 = {
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

    return {
      options,
      options2,
      options3,
    };
  },
};
</script>
