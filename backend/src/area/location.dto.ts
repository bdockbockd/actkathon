import { ApiProperty } from '@nestjs/swagger';
import { ToFloat } from 'class-sanitizer';
import { Transform } from 'class-transformer';

export class Latitude {
  @ApiProperty({ required: true, default: '100.53726' })
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
  lat = 100.53726;

  @ApiProperty({ required: true, type: Number })
  @ToFloat()
  @Transform((value) => value && parseFloat(value.value))
  lon = 13.72427;
}

export class LocationDto {
  @ApiProperty({ required: true, default: 100.53726 })
  lat: number;

  @ApiProperty({ required: true, default: 13.72427 })
  lon: number;
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
