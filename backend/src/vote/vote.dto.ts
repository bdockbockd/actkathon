import { ApiProperty } from '@nestjs/swagger';
import { IsLatitude, IsLongitude, IsNotEmpty } from 'class-validator';
export class VoteDto {

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

  @ApiProperty({ required: true, default: 'สยาม' })
  locationName: string;

  @ApiProperty()
  imageFile: string;

}
