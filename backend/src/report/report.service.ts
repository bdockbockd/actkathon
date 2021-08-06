import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AreaService } from 'src/area/area.service';
import { CitizenService } from 'src/user/citizen/user.service';
import { Rep } from 'src/user/representative/user.schema';
import { RepresentativeService } from 'src/user/representative/user.service';
import { ReportDto } from './report.dto';
import { Report, ReportDocument } from './report.schema';

// const INVITE_TTL_MINS = 60 * 24 * 7;
// const INVITE_BASE_URL = 'https://zenbrief.com/invite';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<ReportDocument>,
    private readonly citizenService: CitizenService,
    private readonly areaService: AreaService,
    private readonly representativeService: RepresentativeService,
  ) {}

  async create(report: ReportDto, creatorId: string) {
    const location = await this.areaService.findLocation({ lat: report.latitude, lon: report.longitude });
    const creator = await this.citizenService.findById(creatorId);
    // if (report.maintainerId) {
    //   const maintainer: Rep = await this.representativeService.findById(report.maintainerId)
    //   const newReport = new this.reportModel({ ...report, location, creator, maintainer });
    //   return newReport.save();
    // } else {
    const maintainer: Rep = await this.areaService.findRepresentativefromLocation(location);
    const newReport = new this.reportModel({ ...report, location, creator, maintainer });
    return newReport.save();
    // }
  }

  async vote(reportId: string, citizenId: string) {
    //   TODO
    const citizen = await this.citizenService.findById(citizenId);
    if (citizen) {
      this.reportModel.findByIdAndUpdate(reportId, { $inc: { vote: 1 } });
    }
  }

  async getReports(filter?: any) {
    return this.reportModel.find(filter);
  }
}
