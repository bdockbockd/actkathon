import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AreaService } from 'src/area/area.service';
import { ReverseGeocodeDto } from 'src/area/location.dto';
import { JWTPayloadDto } from 'src/auth/auth.dto';
import { UserRole } from 'src/constant/user.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { UserId } from 'src/decorators/user-id.decorator';
import { User } from 'src/decorators/user.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { CitizenService } from 'src/user/citizen/user.service';
import { RepresentativeService } from 'src/user/representative/user.service';
import { PublicAPI } from '../decorators/public-api.decorator';
import { ReportDto } from './report.dto';
import { ReportService } from './report.service';

@ApiBearerAuth()
@ApiTags('Report')
@UseGuards(RolesGuard)
@Controller('report')
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
    private readonly areaService: AreaService,
    private readonly citizenService: CitizenService,
    private readonly representativeService: RepresentativeService,
  ) {}

  @Roles(UserRole.NCZ)
  @Post('vote/:id')
  async vote(@UserId() userId: string, @Param('id') reportId: string) {
    return this.reportService.vote(reportId, userId);
  }

  @Roles(UserRole.NCZ)
  @Post('create')
  async create(@UserId() userId: string, @Body() report: ReportDto) {
    //   userId is phone
    return this.reportService.create(report, userId);
  }

  // Report that we have involved with
  @Roles(UserRole.NCZ, UserRole.Representative)
  @Get('ownedReport')
  async fetchOwnedReport(@User() user: JWTPayloadDto) {
    if (user.role == UserRole.NCZ) {
      const citizen = await this.citizenService.findById(user.userId);
      return this.reportService.getReports({ creator: citizen });
    } else if (user.role == UserRole.Representative) {
      const rep = await this.representativeService.findById(user.userId);
      return this.reportService.getReports({ maintainer: rep });
    }
  }

  @PublicAPI()
  @Get('ranking')
  async rankingRepresentative() {
    //   Optimize with query command in the future
    //   const unfinishedReports = this.reportService.getReports({ status: { $ne: ReportStatus.Finished }})
    return this.reportService.aggGroup();
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
