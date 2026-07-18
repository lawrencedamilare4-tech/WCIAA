export interface ApiResponse<T> {
  data: T;
  error?: string | null;
  status: number;
}
