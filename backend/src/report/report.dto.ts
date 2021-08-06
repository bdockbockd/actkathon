import { ApiProperty } from '@nestjs/swagger';
import { IsLatitude, IsLongitude, IsNotEmpty } from 'class-validator';
export class ReportDto {
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  topic: string;

  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  description: string;

  @IsLatitude()
  @ApiProperty({ required: true, default: "100.53726" })
  latitude: string;

  @IsLongitude()
  @ApiProperty({ required: true, default: "13.72427" })
  longitude: string;

  //   @ApiPropertyOptional()
  //   maintainerId?: string;
}
