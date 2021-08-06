import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AreaService } from 'src/area/area.service';
import { ReverseGeocodeDto } from 'src/area/location.dto';
import { UserId } from 'src/decorators/user-id.decorator';
import { PublicAPI } from '../decorators/public-api.decorator';
import { ReportDto } from './report.dto';
import { ReportService } from './report.service';

@ApiBearerAuth()
@ApiTags('Report')
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService, private readonly areaService: AreaService) {}

  @Post('vote/:id')
  async vote(@UserId() phone: string, @Param('id') reportId: string) {
    return this.reportService.vote(reportId, phone);
  }

  @Post('create')
  async create(@UserId() userId: string,@Body() report: ReportDto) {
    //   userId is phone
    return this.reportService.create(report,userId);
  }
  
  // Report that we have involved with   
  @Get('citizen/ownedReport')
  async fetchOwnedReport(@UserId() userId: string) {

  }

  @PublicAPI()
  @Get('fetch/all')
  fetchAllReports() {
    return this.reportService.getReports({});
  }

  @PublicAPI()
  @Get('fetch/nearby')
  @ApiQuery({ name: 'lat', required: false })
  @ApiQuery({ name: 'lon', required: false })
  async fetchNearByReports(@Query('lat', ParseIntPipe) lat: string, @Query('lon', ParseIntPipe) lon: string) {
    let location: ReverseGeocodeDto = await this.areaService.findLocation({ lat, lon });
    // Only fetch in level of province
    return this.reportService.getReports({ 'location.province': location.province });
  }





  
}
