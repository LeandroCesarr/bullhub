export const HttpMethodEnum = {
  GET: "get",
  POST: "post",
  PUT: "put",
  DELETE: "delete",
} as const;

export type HttpMethodEnum = (typeof HttpMethodEnum)[keyof typeof HttpMethodEnum];
