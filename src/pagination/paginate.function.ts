import { SelectQueryBuilder } from 'typeorm';
import { PaginationResult } from './pagination-result.entity';
import { PaginateOptions } from './pagination.dto';

export async function paginate<T>(
  qb: SelectQueryBuilder<T>,
  options: PaginateOptions = new PaginateOptions(),
): Promise<PaginationResult<T>> {
  const offset = (options.currentPage - 1) * options.limit;
  const data = await qb.limit(options.limit).offset(offset).getMany();

  return new PaginationResult<T>({
    first: offset + 1,
    last: offset + data.length,
    limit: options.limit,
    total: options.total ? await qb.getCount() : null,
    data,
  });
}
