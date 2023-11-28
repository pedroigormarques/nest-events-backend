import { IsBoolean, IsOptional, IsPositive } from 'class-validator';
import { Type, Transform, TransformationType } from 'class-transformer';

export class PaginateOptions {
  @Type(() => Number)
  @IsPositive()
  @IsOptional()
  limit = 10;

  @Type(() => Number)
  @IsPositive()
  @IsOptional()
  currentPage = 1;

  @Transform((params) => {
    if (params.type === TransformationType.PLAIN_TO_CLASS) {
      const value: string = params.value;
      if (['true', 'on', 'yes', '1'].includes(value.toLowerCase())) {
        return true;
      }
      if (['false', 'off', 'no', '0'].includes(value.toLowerCase())) {
        return false;
      }
    }
    return params.value;
  })
  @IsBoolean()
  @IsOptional()
  total?: boolean;
}
