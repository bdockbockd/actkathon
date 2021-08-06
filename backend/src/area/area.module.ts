import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AreaController } from './area.controller';
import { Area, AreaSchema } from './area.schema';
import { AreaService } from './area.service';
import { Rep, RepSchema } from './rep.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Rep.name, schema: RepSchema }]),
    MongooseModule.forFeature([{ name: Area.name, schema: AreaSchema }]),
    HttpModule,
  ],
  controllers: [AreaController],
  providers: [AreaService],
})
export default class AreaModule {}
