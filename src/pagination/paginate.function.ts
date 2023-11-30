import { SelectQueryBuilder } from 'typeorm';
import { PaginateOptions } from './pagination.dto';
import { Type } from '@nestjs/common';

export async function paginate<T, ClassPaginated>(
  qb: SelectQueryBuilder<T>,
  classRef: Type<ClassPaginated>,
  options: PaginateOptions = new PaginateOptions(),
): Promise<ClassPaginated> {
  const offset = (options.currentPage - 1) * options.limit;
  const data = await qb.limit(options.limit).offset(offset).getMany();

  return new classRef({
    first: offset + 1,
    last: offset + data.length,
    limit: options.limit,
    total: await qb.getCount(),
    data,
  });
}
