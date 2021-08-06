import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
// import { PublicAPI } from '../decorators/public-api.decorator';
import { AreaService } from './area.service';
import { ReverseGeocodeDto } from './location.dto';
// import { Rep } from './rep.schema';
// import { Area } from './area.schema';

@ApiTags('Area')
@Controller('area')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @Get('province')
  async findAllProvince() {
    return this.areaService.getProvinces();
  }

  @Get('find/:province')
  async findArea(@Param('province') province: string) {
    return this.areaService.getAreaList(province);
  }

  @ApiQuery({ name: 'lat', required: false })
  @ApiQuery({ name: 'lon', required: false })
  @Get('findLocation')
  async findLocation(@Query('lat', ParseIntPipe) lat: number, @Query('lon', ParseIntPipe) lon: number) {
    return await this.areaService.findLocation({ lat, lon });
  }

  @Get('findLocalRepresentative')
  @ApiQuery({ name: 'lat', required: false })
  @ApiQuery({ name: 'lon', required: false })
  async findLocalRepresentatives(@Query('lat', ParseIntPipe) lat: number, @Query('lon', ParseIntPipe) lon: number) {
    let { province, district, subdistrict }: ReverseGeocodeDto = await this.areaService.findLocation({ lat, lon });
    province = province.replace("จ.","จังหวัด")
    return await this.areaService.findRepresentative({ province });
  }
}
