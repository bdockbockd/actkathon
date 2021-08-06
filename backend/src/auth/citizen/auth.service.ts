import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto, AuthResponseDto } from 'src/auth/auth.dto';
import { UserRole } from 'src/constant/user.enum';
import { Citizen } from 'src/user/citizen/user.schema';
import { UserService } from 'src/user/citizen/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly userService: UserService) {}

  // TODO Upgrade validation in the future
  async validateUser(credentials: AuthCredentialsDto): Promise<Citizen> {
    const user: Citizen = await this.userService.findByPhone(credentials.phoneNumber);
    if (user) {
      return user;
    }
    return null;
  }

  async login(credential: AuthCredentialsDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(credential);
    if (!user) {
      throw new UnauthorizedException('Phone Number is not registered yet');
    }

    const access_token = this.jwtService.sign({ phoneNumber: user.phoneNumber, role: UserRole.NCZ });
    return { access_token };
  }

  async register(user: Citizen): Promise<AuthResponseDto> {
    const existedUser = await this.userService.findByPhone(user.phoneNumber);
    if (existedUser) {
      throw new BadRequestException('Phone Number already registered');
    }
    await this.userService.create(user);
    const credentials = { phoneNumber: user.phoneNumber };
    return this.login(credentials);
  }
}
