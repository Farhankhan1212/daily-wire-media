import axios from "axios";
const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";
const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminInfo");
    }
    return Promise.reject(err);
  }
);

// --- Auth ---
export const loginAdmin = (data) => api.post("/admin/login", data);
export const getMe = () => api.get("/admin/me");

// --- News ---
export const fetchNews = (params) => api.get("/news", { params });
export const fetchNewsBySlug = (slug) => api.get(`/news/${slug}`);
export const fetchNewsById = (id) => api.get(`/news/id/${id}`);
export const searchSuggestions = (q) => api.get("/news/search/suggestions", { params: { q } });
export const getDashboardStats = () => api.get("/news/stats/dashboard");
export const createNews = (formData) =>
  api.post("/news", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const updateNews = (id, formData) =>
  api.put(`/news/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteNews = (id) => api.delete(`/news/${id}`);

// --- Categories ---
export const fetchCategories = () => api.get("/categories");
export const createCategory = (data) => api.post("/categories", data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// --- Tags ---
export const fetchTags = () => api.get("/tags");

// --- Subscribers ---
export const subscribeNewsletter = (email) => api.post("/subscribers", { email });

export default api;
