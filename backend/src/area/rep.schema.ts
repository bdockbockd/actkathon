import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { ApiProperty } from '@nestjs/swagger';
// import { IsPhoneNumber } from 'class-validator';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export type RepDocument = Rep & Document;

@Schema({ timestamps: true })
export class Rep {
  _id?: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String, unique: true })
  name: string;

  @Prop({ type: String })
  imageProfileURL: string;

  @Prop({ type: String })
  profileURL: string;

  @Prop({ type: String })
  id: string;

  @Prop({ type: String })
  party: string;

  @Prop({ type: String })
  province: string;

  // areaNumber
  @Prop({ type: String })
  area: string;
}

export const RepSchema = SchemaFactory.createForClass(Rep);
