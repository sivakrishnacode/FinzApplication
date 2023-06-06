<template>
  <div class="q-mx-sm q-my-md q-gutter-y-md q-px-xl">
    <!-- search and add btn -->
    <div class="row justify-center q-gutter-x-md no-wrap">
      <q-select
        dense
        outlined
        rounded
        use-input
        fill-input
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

        <!-- <template v-slot:option="scope">
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
        </template> -->
      </q-select>
    </div>

    <!-- <q-separator /> -->

    <!-- table Container -->
    <div class="table-container">
      <q-table
        ref="tableRef"
        :rows="rows"
        :columns="columns"
        row-key="name"
        separator="horizontal"
        style="border-radius: 12px"
        class="q-py-md"
        flat
        hide-bottom
      >
        <!-- body -->
        <template #body="props">
          <q-tr
            :props="props"
            class="text-center cursor-pointer"
            style="border: 2px solid gray"
          >
            <q-td key="date">
              <div style="font-size: 15px">transectionID</div>
            </q-td>

            <!-- org name -->
            <q-td key="transectionID">
              <div style="font-size: 15px">transectionID</div>
            </q-td>

            <!-- email -->
            <q-td key="paymentID">
              <div style="font-size: 15px">paymentID</div>
            </q-td>

            <!-- contact num -->
            <q-td key="invoiceID">
              <div style="font-size: 15px">invoiceID</div>
            </q-td>

            <q-td key="payment">
              <div style="font-size: 15px">payment</div>
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
import { ref, onMounted } from "vue";
import { api } from "src/boot/axios";

export default {
  name: "accounting_page",
  setup() {
    const rows = ref([1, 2, 3, 4, 4, 5]);
    const columns = ref([
      {
        name: "date",
        field: "date",
        align: "center",
        label: "Date",
      },
      {
        name: "transectionID",

        field: "transectionID",

        label: "Transection ID",
        align: "center",
      },
      {
        name: "paymentID",

        field: "paymentID",

        label: "Payment ID",
        align: "center",
      },
      {
        name: "invoiceID",
        field: "invoiceID",
        align: "center",
        label: "Invoice ID",
      },
      {
        name: "payment",
        field: "payment",
        label: "Payment",
        align: "center",
      },
    ]);
    function getAccountingList() {
      api({
        method: "GET",
      });
    }

    onMounted(() => {});

    return {
      rows,
      columns,
    };
  },
};
</script>

<style></style>
