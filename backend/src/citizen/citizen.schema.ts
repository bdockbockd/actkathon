import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from 'class-validator';
import * as mongoose from 'mongoose';

export type CitizenDocument = Citizen & Document;

@Schema({ timestamps: true })
export class Citizen {
  _id?: mongoose.Schema.Types.ObjectId;

  @IsPhoneNumber('TH')
  @ApiProperty({ required: true, default: '+66918814307' })
  @Prop({ required: true, type: Number })
  phoneNumber: number;
}

export const CitizenSchema = SchemaFactory.createForClass(Citizen);
