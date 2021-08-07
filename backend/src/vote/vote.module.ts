import { forwardRef, Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import AreaModule from 'src/area/area.module';
import { ReportModule } from 'src/report/report.module';
import { VoteController } from './vote.controller';
import { Vote, VoteSchema } from './vote.schema';
import { VoteService } from './vote.service';

@Global()
@Module({
  imports: [forwardRef(()=>ReportModule),MongooseModule.forFeature([{ name: Vote.name, schema: VoteSchema }]), AreaModule],
  controllers: [VoteController],
  providers: [VoteService],
  exports: [VoteService],
})
export class VoteModule {}
