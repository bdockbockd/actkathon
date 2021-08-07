import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsLatitude, IsLongitude } from 'class-validator';
import * as mongoose from 'mongoose';
import { Document, Types } from 'mongoose';
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

  //   @Prop()
  //   location: Partial<>

  @Prop({ required: true })
  @Prop({ required: true, type: String })
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

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Rep' })
  maintainer: Rep | Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Citizen' })
  creator: Citizen | Types.ObjectId;

  @Prop({ default: 0, type: Number })
  vote: number;

  @Prop({ required: true, default: 'สยาม' })
  locationName: string;

  @Prop({ type: String })
  imaegFile: string;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
