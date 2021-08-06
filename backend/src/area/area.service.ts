import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosResponse } from 'axios';
import { Model } from 'mongoose';
import { Area, AreaDocument } from './area.schema';
import { LocationDto, ReverseGeocodeDto } from './location.dto';
import { Rep, RepDocument } from './rep.schema';

@Injectable()
export class AreaService {
  constructor(
    @InjectModel(Area.name) private areaModel: Model<AreaDocument>,
    @InjectModel(Rep.name) private repModel: Model<RepDocument>,
    private httpService: HttpService,
  ) {}

  async getProvinces() {
    const provinceList: { province: string }[] = await this.areaModel.find({}, { province: 1, _id: 0 }).exec();
    return provinceList.map((obj) => obj.province);
  }

  async getAreaList(province: string) {
    const areaObject = await this.areaModel.findOne({ province: province }).exec();
    if (areaObject) {
      const { area } = areaObject;
      return Object.entries(area).map(([key, v]) => {
        let obj = {};
        obj[key.split('_')[1]] = v;
        return obj;
      });
    } else {
      throw new BadRequestException('Bad province requested');
    }
  }

  async findLocation(location: LocationDto): Promise<ReverseGeocodeDto> {
    // return;
    // 31e8f64bd340c1e18ac7d2115ff1adbe
    const param = {
      lon: location.lon,
      lat: location.lat,
      key: process.env.LONGDO_MAP_KEY,
    };

    const url = 'https://api.longdo.com/map/services/address';
    let response: AxiosResponse<ReverseGeocodeDto>;
    try {
      response = await this.httpService.get(url, { params: param }).toPromise();
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Wrong Latitude, Longitude');
    }

    return response.data;
  }

  async findRepresentative(filter: Partial<Rep>) {
    return this.repModel.find(filter).exec();
  }
}
