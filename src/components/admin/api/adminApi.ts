import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://localhost:7179/",
  timeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS ?? 15000),
});
