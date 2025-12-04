import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:2001";
export const IS_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export const getImageUrl = (path) => {
  if (!path) return "https://placehold.co/600x400?text=No+Image";
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path}`;
};

const api_url = axios.create({
  baseURL: API_BASE_URL,
});

export default api_url;