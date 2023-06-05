import axios from "axios";

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
  baseURL: "http://192.168.0.177:8080/rest/s1/finzApp",
});
// my ip 192.168.0.177
// arun 192.168.0.229

export { api };
