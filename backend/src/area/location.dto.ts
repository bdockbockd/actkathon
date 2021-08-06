import { ApiProperty } from '@nestjs/swagger';
import { ToFloat } from 'class-sanitizer';
import { Transform } from 'class-transformer';

export class Latitude {
  @ApiProperty({ required: true, default: '12.53726' })
  lat: string;
}

export class Longitude {
  @ApiProperty({ required: true, default: '100.53726' })
  lon: string;
}

export class LocationQuery {
  @ApiProperty({ required: true, type: Number })
  @ToFloat()
  @Transform((value) => value && parseFloat(value.value))
  lat = 13.53726;

  @ApiProperty({ required: true, type: Number })
  @ToFloat()
  @Transform((value) => value && parseFloat(value.value))
  lon = 100.72427;
}

export class LocationDto {
  @ApiProperty({ required: true, default: "12.73726" })
  lat: string;

  @ApiProperty({ required: true, default: "100.72427" })
  lon: string;
}

export class ReverseGeocodeDto {
  geocode: string;
  country: string;
  province: string;
  district: string;
  subdistrict: string;
  postcode: string;
  aoi?: string;
  road?: string;
  road_lon: number;
  road_lat: number;
}
