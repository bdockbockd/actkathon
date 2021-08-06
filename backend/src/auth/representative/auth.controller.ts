import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PublicAPI } from '../../decorators/public-api.decorator';
import { AuthCredentialDto, RepCredentialDto } from '../auth.dto';
import { AuthService } from './auth.service';

@ApiBearerAuth()
@ApiTags('Representative')
@Controller('representative')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicAPI()
  @Post('login')
  async login(@Body() credential: AuthCredentialDto) {
    return this.authService.login(credential);
  }

  // @PublicAPI()
  // @Post('password/change')
  // async changePassword(@Body() dto: ChangePasswordDto): Promise<AuthResponseDto> {
  //   return this.authService.changePassword(dto);
  // }

  // @PublicAPI()
  // @Post('register')
  // async register(@Body() credential: RepCredentialDto) {
  //   console.log(credential);
  //   return this.authService.register(credential);
  // }
}
