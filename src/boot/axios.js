import axios from "axios";

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
  baseURL: "https://7b02-14-97-230-6.ngrok-free.app/rest/s1/finzApp",
});

// const api = axios.create({
//   baseURL: "https://ce99-14-97-230-6.ngrok-free.app/rest/s1/finzApp",
// headers : {
//   "ngrok-skip-browser-warning": true
// }

// });

// 192.168.0.153 ranjith
// my ip 192.168.0.177
// arun 192.168.0.229

export { api };
