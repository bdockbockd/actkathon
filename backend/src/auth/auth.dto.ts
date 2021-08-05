import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthCredentialsDto {
  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}

export class AuthResponseDto {
  access_token: string;
}

export class ChangePasswordDto extends AuthCredentialsDto {
  @ApiProperty()
  newPassword: string;
}
