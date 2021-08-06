import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UserRole } from 'aws-sdk/clients/workmail';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWTPayloadDto } from './auth.dto';
// import { RepresentativeService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secretKey'),
    });
  }

  async validate(payload: { userId: string; iat: number; exp: number; role: UserRole; phoneNumber: string; }): Promise<JWTPayloadDto> {
    const { iat, userId, role, phoneNumber } = payload;
    // TODO validate something
    // const passwordChangedDate = await this.userService.getPasswordChangedDate(userId);
    // if (passwordChangedDate.getTime() > (iat + 1) * 1000) {
    //   throw new UnauthorizedException('Token Expired');
    // }
    return {userId, role,phoneNumber};
  }
}
