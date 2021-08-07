import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import endOfDay from 'date-fns/endOfDay';
// import startOfDay from 'date-fns/startOfDay';
import { Model } from 'mongoose';
import { Report } from 'src/report/report.schema';
import { ReportService } from 'src/report/report.service';
import { Citizen } from 'src/user/citizen/user.schema';
import { CitizenService } from 'src/user/citizen/user.service';
import { Vote, VoteDocument } from './vote.schema';

// const INVITE_TTL_MINS = 60 * 24 * 7;
// const INVITE_BASE_URL = 'https://zenbrief.com/invite';

@Injectable()
export class VoteService {
  constructor(
    @InjectModel(Vote.name) private voteModel: Model<VoteDocument>,
    // @InjectModel(Report.name) private reportModel: Model<ReportDocument>,
    private readonly citizenService: CitizenService,
    @Inject(forwardRef(() => ReportService))
    private readonly reportService: ReportService,
  ) {}

  async getVotedReport(voterId: string): Promise<Report[]> {
    const citizen: Citizen = await this.citizenService.findById(voterId);
    // TODO add date filter functionality
    const votes = await this.voteModel.find({ voter: citizen }).populate('report').exec();
    return votes.map((vote) => vote.report as Report);
  }

  async getVoteAndReport(voterId: string, reportId: string) {
    const report = await this.reportService.findById(reportId);
    const voter = await this.citizenService.findById(voterId);
    return { report, voter };
  }

  async isAbleToReport(voterId: string) {
    let start = new Date();
    start.setUTCHours(0, 0, 0, 0);

    let end = new Date();
    end.setUTCHours(23, 59, 59, 999);

    const vote = await this.voteModel.findOne({
      voter: voterId,
      createdAt: { $gte: start, $lte: end },
    });
    return !vote;
  }

  // TODO Add functionality to check limit vote before vote
  async createVote(voterId: string, reportId: string) {
    // const { report, voter } = await this.getVoteAndReport(voterId, reportId);
    const canVote = await this.isAbleToReport(voterId);
    if (canVote) {
      const newVote = new this.voteModel({ voter: voterId, report: reportId });
      return newVote.save();
    } else {
      throw new BadRequestException('Vote denied, already voted');
    }
  }

  async removeVote(voterId: string, reportId: string) {
    const { report, voter } = await this.getVoteAndReport(voterId, reportId);
    await this.voteModel.findOneAndDelete({ report, voter }).exec();
  }
}
