import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from 'class-validator';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export type CitizenDocument = Citizen & Document;

@Schema({ timestamps: true })
export class Citizen {
  _id?: mongoose.Schema.Types.ObjectId;

  @IsPhoneNumber('TH')
  @ApiProperty({ required: true, default: '+66918814300' })
  @Prop({ required: true, type: String, unique: true })
  phoneNumber: string;
}

export const CitizenSchema = SchemaFactory.createForClass(Citizen);
