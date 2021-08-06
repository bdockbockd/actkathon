import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Representative, RepresentativeDocument } from './user.schema';

// const INVITE_TTL_MINS = 60 * 24 * 7;
// const INVITE_BASE_URL = 'https://zenbrief.com/invite';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Representative.name) private representativeModel: Model<RepresentativeDocument>,
    private configService: ConfigService,
  ) {}

  findByPhone(phone: string) {
    return this.representativeModel.findOne({ phoneNumber: phone }).exec();
  }

  async me(phone: string) {
    const user = await this.findByPhone(phone);
    // const credit = await this.billService.getCurrentCreditByTeamOwner(String(user.teamOwner));
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
    };
  }

  create(user: Representative) {
    const newUser = new this.representativeModel(user);
    return newUser.save();
  }


  

  
}
