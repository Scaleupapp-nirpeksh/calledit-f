export interface ApiError {
  detail: string | ValidationError[];
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
  ctx?: Record<string, unknown>;
}
