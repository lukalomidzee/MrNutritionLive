import axios from "axios";
import { mockAdminAdapter } from "./mockAdminApi";
import { STATIC_DEMO_ENABLED } from "@/lib/staticDemo";

export const api = axios.create({
  baseURL: STATIC_DEMO_ENABLED ? "/" : process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://localhost:7179/",
  timeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS ?? 15000),
  adapter: STATIC_DEMO_ENABLED ? mockAdminAdapter : undefined,
});
