import { HttpMethodEnum } from "../enums/httpMethodEnum.ts";
import type { ApiResponse } from "../types";

export class ApiClient {
  private static baseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

  public static async request<T>(
    method: HttpMethodEnum,
    path: string,
    body?: Record<string, unknown>,
  ): Promise<ApiResponse<T>> {
    const url = new URL(`${ApiClient.baseUrl}/${path}`);

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });

    return (await res.json()) as ApiResponse<T>;
  }
}
