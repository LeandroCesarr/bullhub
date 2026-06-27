type ApiResponseMeta = {
  status: number;
  message: string;
};

export class ApiResponse<T> {
  status: number;
  message: string;
  data: T;

  private constructor(meta: ApiResponseMeta, data: T) {
    this.status = meta.status;
    this.message = meta.message;
    this.data = data;
  }

  static ok<T>(data: T, message = "ok"): ApiResponse<T> {
    return new ApiResponse({ status: 200, message }, data);
  }

  static created<T>(data: T, message = "created"): ApiResponse<T> {
    return new ApiResponse({ status: 201, message }, data);
  }

  static error(message: string, status = 500): ApiResponse<null> {
    return new ApiResponse({ status, message }, null);
  }

  static notFound(message = "not found"): ApiResponse<null> {
    return new ApiResponse({ status: 404, message }, null);
  }

  static noContent(message = "no content"): ApiResponse<null> {
    return new ApiResponse({ status: 204, message }, null);
  }
}
