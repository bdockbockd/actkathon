import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PublicAPI } from '../../decorators/public-api.decorator';
import { Citizen } from '../../user/citizen/user.schema';
import { AuthCredentialsDto } from '../auth.dto';
import { AuthService } from './auth.service';

@ApiBearerAuth()
@ApiTags('Citizen')
@Controller('citizen')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicAPI()
  @Post('login')
  async login(@Body() credential: AuthCredentialsDto) {
    return this.authService.login(credential);
  }

  // @PublicAPI()
  // @Post('password/change')
  // async changePassword(@Body() dto: ChangePasswordDto): Promise<AuthResponseDto> {
  //   return this.authService.changePassword(dto);
  // }

  @PublicAPI()
  @Post('register')
  async register(@Body() user: Citizen) {
    return this.authService.register(user);
  }
}
