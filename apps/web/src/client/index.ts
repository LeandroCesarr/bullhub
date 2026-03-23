import { stringify } from "qs";
import { HttpMethodEnum } from "@/enums/httpMethodEnum";
import type { ApiResponse } from "@/types";

export class ApiClient {
  private static baseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

  public static async request<T>(
    method: HttpMethodEnum,
    path: string,
    body?: Record<string, unknown>,
    query?: Record<string, unknown>,
  ): Promise<ApiResponse<T>> {
    let url = `${ApiClient.baseUrl}/${path}`;

    if (query && method === HttpMethodEnum.GET) {
      url += `?${stringify(query)}`;
    }

    const res = await fetch(new URL(url), {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });

    return (await res.json()) as ApiResponse<T>;
  }
}
