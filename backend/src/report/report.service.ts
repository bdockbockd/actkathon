import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AreaService } from 'src/area/area.service';
import { CitizenService } from 'src/user/citizen/user.service';
import { Rep } from 'src/user/representative/user.schema';
import { VoteService } from 'src/vote/vote.service';
import { ReportDto } from './report.dto';
import { ReportStatus } from './report.enum';
import { Report, ReportDocument } from './report.schema';

// const INVITE_TTL_MINS = 60 * 24 * 7;
// const INVITE_BASE_URL = 'https://zenbrief.com/invite';
@Injectable()
export class ReportService {

  constructor(
    @InjectModel(Report.name) private reportModel: Model<ReportDocument>,
    private readonly citizenService: CitizenService,
    private readonly areaService: AreaService,
    @Inject(forwardRef(() => VoteService))
    private readonly voteService: VoteService,
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

  async vote(reportId: string, userId: string) {
    //   TODO handle atomic transaction
    await this.voteService.createVote(userId, reportId);
    await this.reportModel.findByIdAndUpdate(reportId, { $inc: { vote: 1 } }).exec();
  }

  async getReports(filter?: any) {
    return this.reportModel.find(filter);
  }

  async rankReport() {
    return this.reportModel.aggregate([
      {
        $match: {
          status: {
            $ne: ReportStatus.Finished,
          },
        },
      },
      { $group: { _id: '$maintainer', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
  }

  findById(id: string): Promise<Report> {
    return this.reportModel.findById(id).exec();
  }
}
