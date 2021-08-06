import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Rep, RepSchema } from '../user/representative/user.schema';
import { AreaController } from './area.controller';
import { Area, AreaSchema } from './area.schema';
import { AreaService } from './area.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Rep.name, schema: RepSchema }]),
    MongooseModule.forFeature([{ name: Area.name, schema: AreaSchema }]),
    HttpModule,
  ],
  controllers: [AreaController],
  providers: [AreaService],
  exports: [AreaService],
})
export default class AreaModule {}
