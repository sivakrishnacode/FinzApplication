const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("layouts/MainLayout.vue"),
    redirect: () => {
      return { name: "dashboard_page" };
    },
    children: [
      {
        path: "dashboard",
        name: "dashboard_page",
        component: () => import("pages/DashBoard.vue"),
      },
      {
        path: "invoice",
        name: "invoice_page",
        component: () => import("src/pages/Invoices/Invoice.vue"),
        children: [
          {
            path: "",
            name: "invoiceList_page",
            component: () => import("src/pages/Invoices/InvoiceList.vue"),
          },
          {
            path: ":invoiceId/Invoice_Info",
            name: "invoiceInfo_page",
            component: () => import("src/pages/Invoices/InvoiceInfo.vue"),
          },
        ],
      },
      {
        path: "accounting",
        name: "accounting_page",
        component: () => import("pages/Accounting/Accounting.vue"),
      },
      {
        path: "payment",
        name: "payment_page",
        component: () => import("pages/Payment.vue"),
      },
      {
        path: "vendors",
        name: "vendor_pages",
        component: () => import("src/pages/Vendors/Vendors.vue"),
        children: [
          {
            path: "",
            name: "vendorList_page",
            component: () => import("src/pages/Vendors/VendorList.vue"),
          },
          {
            path: ":vendorId/vendorInfo",
            name: "vendorInfo_page",
            component: () => import("src/pages/Vendors/VendorInfo.vue"),
          },
          {
            path: "createVendor",
            name: "createVendor_page",
            component: () => import("src/pages/Vendors/CreateVendor.vue"),
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../pages/loginRegister/isLoginOrRegister.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../pages/loginRegister/isLoginOrRegister.vue"),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/PageNotFound.vue"),
  },
];

export default routes;
