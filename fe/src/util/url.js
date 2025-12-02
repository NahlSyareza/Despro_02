import axios from "axios";

const api_url = axios.create({
  // baseURL: "http://72.61.140.231:2001/",
  baseURL: "http://127.0.0.1:2001", // for local testing
});

export default api_url;
