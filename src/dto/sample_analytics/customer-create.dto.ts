import {
  IsString,
  IsEmail,
  IsDate,
  IsArray,
  IsInt,
  IsOptional,
  MinLength,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DocKeyMap } from '../../decorators';

class TierDetailDto {
  @IsString()
  @IsOptional()
  @DocKeyMap('tier')
  tier?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @DocKeyMap('benefits')
  benefits?: string[];

  @IsBoolean()
  @IsOptional()
  @DocKeyMap('active')
  active?: boolean;

  @IsString()
  @IsOptional()
  @DocKeyMap('id')
  id?: string;
}

export class CustomerCreateDto {
  @IsString()
  @MinLength(3)
  @DocKeyMap('customerUsername')
  username: string;

  @IsString()
  @MinLength(2)
  @DocKeyMap('customerName')
  name: string;

  @IsString()
  @IsOptional()
  @DocKeyMap('customerAddress')
  address?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @DocKeyMap('customerBirthdate')
  birthdate?: Date;

  @IsEmail()
  @DocKeyMap('customerEmail')
  email: string;

  @IsArray()
  @IsInt({ each: true })
  @DocKeyMap('customerAccounts')
  accounts: number[];

  @IsOptional()
  @DocKeyMap('customerTiers')
  tier_and_details?: Record<string, TierDetailDto>;
}
