import axios from "axios";

const api_url = axios.create({
  baseURL: "http://72.61.140.231:2001/",
});

export default api_url;
