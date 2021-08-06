import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserId } from 'src/decorators/user-id.decorator';
// import { UserId } from 'src/decorators/user-id.decorator';
// import { RolesGuard } from 'src/guards/roles.guard';
import { RepresentativeService } from './user.service';

@ApiBearerAuth()
@ApiTags('Representative')
@Controller('representative')
// @UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly representativeService: RepresentativeService) {}

  @Get('me')
  me(@UserId() id: string) {
    return this.representativeService.me(id);
  }
}
