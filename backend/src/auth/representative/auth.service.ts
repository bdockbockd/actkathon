import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialDto, AuthResponseDto, RepCredentialDto } from 'src/auth/auth.dto';
import { UserRole } from 'src/constant/user.enum';
import { Rep } from 'src/user/representative/user.schema';
import { RepresentativeService } from 'src/user/representative/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly representativeService: RepresentativeService) {}

  // TODO Upgrade validation in the future
  async validateUser(credentials: AuthCredentialDto): Promise<Rep> {
    const { phoneNumber } = credentials;
    const user: Rep = await this.representativeService.findByPhone(phoneNumber);
    if (user) {
      return user;
    }
    return null;
  }

  async login(credential: AuthCredentialDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(credential);
    if (!user) {
      throw new UnauthorizedException('Phone Number is not registered yet');
    }
    const access_token = this.jwtService.sign({
      userId: user._id,
      phoneNumber: user.phoneNumber,
      role: UserRole.Representative,
    });
    return { access_token };
  }

  async register(credential: RepCredentialDto): Promise<AuthResponseDto> {
    const existedUser: Rep = await this.representativeService.findByPhone(credential.phoneNumber);
    if (existedUser) {
      throw new BadRequestException('Phone Number already registered');
    }

    await this.representativeService.create(credential);
    return this.login(credential);
  }
}
