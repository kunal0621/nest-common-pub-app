import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';
import { DocKeyMap } from '../../decorators';

export class UserCreateDto {
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @DocKeyMap('fullName')
  name: string;

  @IsEmail()
  @DocKeyMap('emailAddress')
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(255)
  @DocKeyMap('passwordHash')
  password: string;
}
