import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AreaService } from 'src/area/area.service';
import { ReverseGeocodeDto } from 'src/area/location.dto';
import { Citizen } from 'src/user/citizen/user.schema';
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
    let location: ReverseGeocodeDto;
    let creator: Citizen;
    let maintainer: Rep;
    location = await this.areaService.findLocation({ lat: report.latitude, lon: report.longitude });
    if (Object.keys(location).length == 0) {
      throw new BadRequestException('Location not found');
    }
    try {
      creator = await this.citizenService.findById(creatorId);
      maintainer = await this.areaService.findRepresentativefromLocation(location);
      const reportObject: Partial<Report> = { ...report, location, creator, maintainer };
      const newReport = new this.reportModel(reportObject);
      return newReport.save();
    } catch {
      throw new BadRequestException('Create report error');
    }
    // }
  }

  async vote(reportId: string, userId: string) {
    // TODO handle atomic transaction
    await this.voteService.createVote(userId, reportId);
    await this.reportModel.findByIdAndUpdate(reportId, { $inc: { vote: 1 } }).exec();
  }

  async getReports(filter?: any) {
    return this.reportModel.find(filter).populate('creator').populate('maintainer');
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
      {
        $lookup: {
          from: 'reps',
          localField: '_id',
          foreignField: '_id',
          as: 'reps',
        },
      },
      { $unwind: '$reps' },
    ]);
  }

  findById(id: string): Promise<Report> {
    return this.reportModel.findById(id).populate('creator').populate('maintainer').exec();
  }
}
