import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserId } from 'src/decorators/user-id.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { CitizenService } from './user.service';

@ApiBearerAuth()
@ApiTags('Citizen')
@Controller('citizen')
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly citizenService: CitizenService) {}

  @Get('me')
  me(@UserId() userId: string) {
    return this.citizenService.me(userId);
  }
}
