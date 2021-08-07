import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Citizen, CitizenDocument } from './user.schema';

// const INVITE_TTL_MINS = 60 * 24 * 7;
// const INVITE_BASE_URL = 'https://zenbrief.com/invite';

@Injectable()
export class CitizenService {
  constructor(
    @InjectModel(Citizen.name) private citizenModel: Model<CitizenDocument>,
    private configService: ConfigService,
  ) {}

  findByPhone(phone: string) {
    // phone = phone.replace('+', '');
    return this.citizenModel.findOne({ phoneNumber: phone }).exec();
  }

  findById(id: string) {
    return this.citizenModel.findById(id).exec();
  }

  async me(id: string) {
    const user = await this.findById(id);
    return user
  }

  create(user: Citizen) {
    const newUser = new this.citizenModel(user);
    return newUser.save();
  }
  
}
