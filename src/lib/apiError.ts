import { AxiosError } from "axios";

export type ApiError = { status?: number; message: string; details?: unknown };

export function toApiError(err: unknown): ApiError {
    const ax = err as AxiosError<any>;
    if (ax?.isAxiosError) {
        return {
            status: ax.response?.status,
            message: ax.response?.data?.message || ax.message || "Request failed",
            details: ax.response?.data,
        };
    }
    return { message: (err as Error)?.message ?? "Unknown error" };
}
