import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsDateString, IsLatitude, IsLongitude } from 'class-validator';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { ReverseGeocodeDto } from 'src/area/location.dto';
import { Citizen } from 'src/user/citizen/user.schema';
import { Rep } from 'src/user/representative/user.schema';
import { ReportStatus } from './report.enum';

export type ReportDocument = Report & Document;

@Schema({ timestamps: true })
export class Report {
  _id?: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, type: ReverseGeocodeDto })
  location: Partial<ReverseGeocodeDto>;

  @Prop({ required: true , type: String})
  topic: string;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({ required: true, default: ReportStatus.Initiated })
  status: ReportStatus;


  @IsLatitude()
  @Prop({ required: true, type: String })
  latitude: string;

  //   @ApiProperty({ required: true })
  @IsLongitude()
  @Prop({ required: true, type: String })
  longitude: string;

  @Prop({ required: true, ref: 'Rep' })
  maintainer: Rep;

  @Prop({required: true, ref: 'Citizen'})
  creator: Citizen


  @Prop({ default: 0, type: Number })
  vote: number;

}

export const ReportSchema = SchemaFactory.createForClass(Report);
