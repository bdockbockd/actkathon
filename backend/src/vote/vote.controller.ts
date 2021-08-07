import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/constant/user.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { UserId } from 'src/decorators/user-id.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { VoteService } from './vote.service';

@ApiBearerAuth()
@ApiTags('Vote')
@UseGuards(RolesGuard)
@Controller('vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Roles(UserRole.NCZ)
  @Get('votedReport/:id')
  async vote(@UserId() userId: string) {
    //   Check user already vote or not
    return this.voteService.getVotedReport(userId);
  }
}
