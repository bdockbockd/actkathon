import { forwardRef, Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import AreaModule from 'src/area/area.module';
import { CitizenModule } from 'src/user/citizen/user.module';
import { VoteModule } from 'src/vote/vote.module';
import { ReportController } from './report.controller';
import { Report, ReportSchema } from './report.schema';
import { ReportService } from './report.service';

@Global()
@Module({
  imports: [forwardRef(()=>VoteModule),forwardRef(()=>AreaModule),forwardRef(()=>CitizenModule),MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]), AreaModule],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}
