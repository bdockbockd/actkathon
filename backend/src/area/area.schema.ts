import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export type AreaDocument = Area & Document;

@Schema({ timestamps: true })
export class Area {
  _id?: mongoose.Schema.Types.ObjectId;

  @Prop({ unique: true })
  province: string;

  // Change to number
  @Prop({ required: true, type: String })
  num_rep: string;

  // Change to number
  @Prop({ required: true, type: String })
  num_area: string;

  @Prop({ required: true, type: Object })
  area: Record<string, string[]>;
}

export const AreaSchema = SchemaFactory.createForClass(Area);
