import { IsInt, IsArray, IsString, Min } from 'class-validator';
import { DocKeyMap } from '../../decorators';

export class AccountCreateDto {
  @IsInt()
  @Min(1)
  @DocKeyMap('accountId')
  account_id: number;

  @IsInt()
  @Min(0)
  @DocKeyMap('limit')
  limit: number;

  @IsArray()
  @IsString({ each: true })
  @DocKeyMap('products')
  products: string[];
}
