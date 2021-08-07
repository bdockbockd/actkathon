import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialDto, AuthResponseDto } from 'src/auth/auth.dto';
import { UserRole } from 'src/constant/user.enum';
import { Citizen } from 'src/user/citizen/user.schema';
import { CitizenService } from 'src/user/citizen/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly citizenService: CitizenService) {}

  // TODO Upgrade validation in the future
  async validateUser(credentials: AuthCredentialDto): Promise<Citizen> {
    const user: Citizen = await this.citizenService.findByPhone(credentials.phoneNumber);
    if (user) {
      return user;
    }
    return null;
  }
  

  async login(credential: AuthCredentialDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(credential);
    if (!user) {
      return await this.register(credential)
      // throw new UnauthorizedException('Phone Number is not registered yet');
    }

    const access_token = this.jwtService.sign({ userId: user._id, phoneNumber: user.phoneNumber, role: UserRole.NCZ });
    return { access_token };
  }

  async register(credential: AuthCredentialDto): Promise<AuthResponseDto> {
    
    // const existedUser = await this.citizenService.findByPhone(credential.phoneNumber);
    // if (existedUser) {
    //   throw new BadRequestException('Phone Number already registered');
    // }

    await this.citizenService.create(credential);
    return this.login({ phoneNumber: credential.phoneNumber });
  }
}
