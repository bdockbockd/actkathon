import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'aws-sdk/clients/workmail';
import { IsPhoneNumber } from 'class-validator';
export class AuthCredentialDto {
  @IsPhoneNumber('TH')
  @ApiProperty({ required: true, default: '0987654321' })
  phoneNumber: string;
}
export class RepCredentialDto {
  @ApiProperty({ required: true, default: '1' })
  public area_number: string;

  @ApiProperty({ required: true, default: 'ราชบุรี' })
  public province: string;

  @IsPhoneNumber('TH')
  @ApiProperty({ required: true, default: '0918814300' })
  public phoneNumber: string;
}

export class AuthResponseDto {
  access_token: string;
}

export class JWTPayloadDto {
  userId: string;
  role: UserRole;
  phoneNumber: string;
}
