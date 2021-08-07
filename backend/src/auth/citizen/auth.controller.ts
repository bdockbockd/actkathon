import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PublicAPI } from '../../decorators/public-api.decorator';
import { AuthCredentialDto } from '../auth.dto';
import { AuthService } from './auth.service';

@ApiBearerAuth()
@ApiTags('Citizen')
@Controller('citizen')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicAPI()
  @Post('login')
  async login(@Body() credential: AuthCredentialDto) {
    return this.authService.login(credential);
  }

  // @PublicAPI()
  // @Post('register')
  // async register(@Body() credential: AuthCredentialDto) {
  //   return this.authService.register(credential);
  // }
}
