import {
  IsInt,
  IsDate,
  IsArray,
  IsString,
  IsOptional,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DocKeyMap } from '../../decorators';

class TransactionItemDto {
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsInt()
  @Min(0)
  amount: number;

  @IsString()
  @DocKeyMap('transactionCode')
  transaction_code: string;

  @IsString()
  symbol: string;

  @IsString()
  price: string;

  @IsString()
  total: string;
}

export class TransactionCreateDto {
  @IsInt()
  @Min(1)
  @DocKeyMap('accountId')
  account_id: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  @DocKeyMap('transactionCount')
  transaction_count?: number;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @DocKeyMap('bucketStartDate')
  bucket_start_date?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @DocKeyMap('bucketEndDate')
  bucket_end_date?: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransactionItemDto)
  @DocKeyMap('transactions')
  transactions: TransactionItemDto[];
}
