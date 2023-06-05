<template>
  <div class="row justify-between no-wrap">
    <!-- Side list -->
    <div
      class="q-gutter-y-sm q-pa-lg"
      style="width: 400px"
      v-if="!$q.screen.lt.md"
    >
      <!-- Search bar -->

      <q-input rounded outlined label="Search" dense>
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>

      <!-- add invoice btn -->
      <q-btn
        rounded
        class="full-width"
        color="primary"
        label="Upload Invoice"
        icon="add"
        no-wrap
        style="height: 20px"
      />

      <q-tabs
        v-model="invoiceListTab"
        outside-arrows
        mobile-arrows
        class="bg-secondary text-white"
        indicator-color="transparent"
        active-class="text-weight-bold bg-red"
        style="border-radius: 14px"
        no-caps
      >
        <q-tab name="All" label="All" class="bg-secondary text-white" />
        <q-tab name="UnPaid" label="UnPaid" class="bg-secondary text-white" />
        <q-tab
          name="PartialPaid"
          label="PartialPaid"
          class="bg-secondary text-white"
        />
        <q-tab name="Paid" label="Paid" class="bg-secondary text-white" />
        <q-tab
          name="Cancelled"
          label="Cancelled"
          class="bg-secondary text-white"
        />
      </q-tabs>

      <!-- <q-scroll-area class="fit" visible="false"> -->
      <!-- List -->
      <q-list class="q-gutter-sm">
        <q-item
          v-for="data in 10"
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
            <q-item-label> data.organizationName </q-item-label>
            <q-item-label class="text-white text-caption">
              {{ data }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <!-- </q-scroll-area> -->
    </div>

    <!-- Vendor Info side -->
    <div class="q-gutter-y-md row justify-center full-width">
      <!-- title -->

      <div class="row full-width justify-center">
        <div
          class="bg-secondary text-center"
          style="border-radius: 0 0 70px 70px; height: 80px; width: 700px"
        >
          <div class="q-mt-md text-primary text-h6">Siva krishna {{ id }}</div>
          <div class="text-blue-grey-1">sivakrishnacoc@gmail.com</div>
        </div>
        <!-- <div class="row justify-start content-center bg-red">
          <q-btn icon="close" />
        </div> -->
      </div>

      <!-- body -->
      <div class="row justify-center">
        <div
          class="item-center bg-secondary q-pa-lg"
          style="border-radius: 17px; min-width: 700px; max-width: 900px"
        >
          <!-- columns -->
          <q-item class="row justify-between">
            <q-item-section class="col-1 text-weight-bold">
              S.NO
            </q-item-section>
            <q-item-section class="col-4 text-weight-bold">
              Product Name
            </q-item-section>
            <q-item-section class="col-2 text-weight-bold row content-center">
              Quantity
            </q-item-section>
            <q-item-section class="col-3 text-weight-bold row content-center">
              Price
            </q-item-section>
          </q-item>

          <q-separator />

          <!-- rows -->
          <q-list v-for="data in 6" :key="data">
            <q-item class="row justify-between text-primary">
              <q-item-section class="col-1">{{ data }}</q-item-section>
              <q-item-section class="col-4">Iphone 14</q-item-section>
              <q-item-section class="col-2 row content-center"
                >21</q-item-section
              >
              <q-item-section class="col-3 row content-center"
                >$53456</q-item-section
              >
            </q-item>
          </q-list>

          <q-separator />

          <!-- total -->
          <q-item class="row justify-end">
            <q-item-section class="col-3 text-weight-bold text-primary text-h6">
              Total:
            </q-item-section>
            <q-item-section class="col-3 text-weight-bold text-h5 text-primary">
              $ 65376
            </q-item-section>
          </q-item>

          <q-separator spaced />

          <!-- Vendor Info -->
          <q-item
            class="row justify-between text-primary q-py-md"
            style="border-radius: 5px"
          >
            <q-item-section class="col-9">
              <q-item-label class="text-primary text-weight-bold">
                Sivakrishna
              </q-item-label>
              <q-item-label class="text-white text-caption">
                sivakrishnacoc@gmail.com
              </q-item-label>
            </q-item-section>

            <q-item-section class="col-3">
              <q-btn
                outline
                rounded
                color="primary"
                icon="arrow_forward"
                label="View Vendor"
              >
              </q-btn>
            </q-item-section>
          </q-item>

          <!-- ststus -->
          <!-- <q-item class="bg-blue">
            <q-item-section>Invoice Status:</q-item-section>
            <q-item-section> APPROVED </q-item-section>
          </q-item> -->

          <!-- note -->
          <q-card
            class="full-width no-shadow bg-orange-3 q-my-sm"
            style="border: 2px solid orange"
          >
            <q-item>
              <q-item-section>
                <q-item-label overline>NOTE:</q-item-label>
                <q-item-label>
                  You can Pay the bill after the approval is complete !
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-card>

          <!-- Submit btn -->
          <q-item class="row justify-evenly">
            <q-btn label="Cancel" rounded outline color="primary" />
            <q-btn label="Approve" rounded color="primary" />
          </q-item>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import { ref } from "vue";

export default {
  name: "invoiceInfo_page",
  setup() {
    const route = useRoute();
    const id = route.params.invoiceId;

    const invoiceListTab = ref("All");

    return {
      id,
      invoiceListTab,
    };
  },
};
</script>

<style \></style>
