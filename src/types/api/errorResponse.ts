export type APIErrorResponse = {
  type: string;
  title: string;
  status: number;
  traceId: string;
  errors: APIError[];
};

export type APIError = {
  id: string[];
};
