export interface BaseTableListResponse<T> {
  [x: string]: any;
  // request拦截器已对data做null -> [] 处理，无需担心null值
  data: T[];
  total: number;
}
