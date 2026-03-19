import axios from "axios";

const server = "http://localhost:3000";

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
};

const api = axios.create({
    baseURL: server,
    withCredentials: true,
});

/* ================= REQUEST INTERCEPTOR ================= */

api.interceptors.request.use((config) => {
    // ✅ Only for unsafe methods
    if (["post", "put", "patch", "delete"].includes(config.method)) {
        const csrfToken = getCookie("csrfToken");
        if (csrfToken) {
            config.headers["x-csrf-token"] = csrfToken;
        }
    }
    return config;
});

/* ================= RESPONSE INTERCEPTOR ================= */

let isRefreshing = false;
let isRefreshingCSRFToken = false;

let failedQueue = [];
let csrfFailedQueue = [];

const processQueue = (error) => {
    failedQueue.forEach((prom) => {
        error ? prom.reject(error) : prom.resolve();
    });
    failedQueue = [];
};

const processCSRFQueue = (error) => {
    csrfFailedQueue.forEach((prom) => {
        error ? prom.reject(error) : prom.resolve();
    });
    csrfFailedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        /* ================= CSRF ERROR ================= */
        if (
            error.response ?.status === 403 &&
            error.response ?.data ?.code ?.startsWith("CSRF_") &&
            !originalRequest._retry
        ) {
            if (isRefreshingCSRFToken) {
                return new Promise((resolve, reject) => {
                    csrfFailedQueue.push({
                        resolve,
                        reject
                    });
                }).then(() => api(originalRequest));
            }

            originalRequest._retry = true;
            isRefreshingCSRFToken = true;

            try {
                await api.post("/refresh-csrf");
                processCSRFQueue(null);
                return api(originalRequest);
            } catch (err) {
                processCSRFQueue(err);
                return Promise.reject(err);
            } finally {
                isRefreshingCSRFToken = false;
            }
        }

        /* ================= ACCESS TOKEN EXPIRED ================= */
        if (
            error.response ?.status === 401 &&
            !originalRequest._retry
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve,
                        reject
                    });
                }).then(() => api(originalRequest));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await api.post("/refresh");
                processQueue(null);
                return api(originalRequest);
            } catch (err) {
                processQueue(err);
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;