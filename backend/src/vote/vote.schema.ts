import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document, Types } from 'mongoose';
import { Report } from 'src/report/report.schema';
import { Citizen } from 'src/user/citizen/user.schema';

export type VoteDocument = Vote & Document;

@Schema({ timestamps: true })
export class Vote {
  _id?: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Citizen' })
  voter: Citizen | Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Report' })
  report: Report | Types.ObjectId;
}

export const VoteSchema = SchemaFactory.createForClass(Vote);
