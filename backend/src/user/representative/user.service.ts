import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RepCredentialDto } from 'src/auth/auth.dto';
import { Rep, RepDocument } from './user.schema';

// const INVITE_TTL_MINS = 60 * 24 * 7;
// const INVITE_BASE_URL = 'https://zenbrief.com/invite';

@Injectable()
export class RepresentativeService {
  constructor(
    @InjectModel(Rep.name) private representativeModel: Model<RepDocument>,
    private configService: ConfigService,
  ) {}

  findByPhone(phone: string) {
    return this.representativeModel.findOne({ phoneNumber: phone }).exec();
  }

  findById(id: string) {
    return this.representativeModel.findById(id).exec();
  }

  async me(id: string) {
    const user: Rep = await this.findById(id);
    return user;
  }

  async create(credential: RepCredentialDto) {
    console.log(credential)
    await this.representativeModel
      .updateOne(
        { area: credential.area_number, province: `จังหวัด${credential.province}` },
        { $set: { phoneNumber: credential.phoneNumber } },
      )
      .exec();
  }
}
