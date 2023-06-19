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
          {
            path: ":invoiceId/payment_page",
            name: "payment",
            component: () => import("src/pages/Invoices/PayPage.vue"),
          },
        ],
      },
      {
        path: "accounting",
        name: "accounting_page",
        component: () => import("pages/Accounting/Accounting.vue"),
        children: [
          {
            path: "",
            name: "accountingList_page",
            component: () => import("src/pages/Accounting/AccountingList.vue"),
          },
          {
            path: ":accTransId/accountingInfo",
            name: "accountingInfo_page",
            component: () => import("src/pages/Accounting/AccountingInfo.vue"),
          },
        ],
      },
      {
        path: "payment",
        name: "payment_page",
        component: () => import("pages/Payments/Payment.vue"),
        children: [
          {
            path: "",
            name: "paymentList_page",
            component: () => import("src/pages/Payments/PaymentList.vue"),
          },
          {
            path: ":paymentId/paymentInfo",
            name: "paymentInfo_page",
            component: () => import("src/pages/Payments/PaymentInfo.vue"),
          },
        ],
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
