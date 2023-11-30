import { PartialType } from '@nestjs/mapped-types';
import { PartialType as GqlPartialType, InputType } from '@nestjs/graphql';
import { CreateEventDto } from './create-event.dto';

export class UpdateEventDto extends PartialType(CreateEventDto) {}

@InputType()
export class UpdateGplEventDto extends GqlPartialType(CreateEventDto) {}
