import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBase64, IsLatitude, IsLongitude, IsNotEmpty, IsString } from 'class-validator';
export class ReportDto {
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  topic: string;

  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  description: string;

  @IsLatitude()
  @ApiProperty({ required: true, default: '13' })
  latitude: string;

  @IsLongitude()
  @ApiProperty({ required: true, default: '100' })
  longitude: string;

  @IsString()
  @ApiProperty({ required: true, default: 'สยาม' })
  locationName: string;

  @IsBase64()
  @ApiPropertyOptional()
  imageFile: string;
}
