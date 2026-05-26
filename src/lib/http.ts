import axios from "axios";


const baseURL = process.env.NEXT_PUBLIC_COURSES_API_BASE_URL as string;
const timeout = Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS ?? 15000);

export const http = axios.create({ baseURL, timeout });

http.interceptors.response.use(
    (res) => res,
    (err) => Promise.reject(err)
);

