export class PaginationResult<T> {
  constructor(partial: Partial<PaginationResult<T>>) {
    Object.assign(this, partial);
  }
  data: T[];
  first: number;
  last: number;
  limit: number;
  total?: number;
}
