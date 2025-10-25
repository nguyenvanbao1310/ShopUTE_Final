import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AdminGuard } from '../../shared/guards/admin.guard';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

@Controller('users')
@UseGuards(AdminGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  list() {
    return this.usersService.listAll();
  }

  @Patch(':id/status')
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserStatusDto) {
    return this.usersService.updateStatus(id, dto.isActive);
  }

  @Get('search')
  search(
    @Query('name') name?: string,
    @Query('role') role?: string,
    @Query('isActive') isActiveStr?: string,
  ) {
    let isActive: boolean | undefined = undefined;
    if (typeof isActiveStr === 'string') {
      const v = isActiveStr.trim().toLowerCase();
      if (v === 'true' || v === '1') isActive = true;
      else if (v === 'false' || v === '0') isActive = false;
    }
    return this.usersService.search({ name, role, isActive });
  }

  @Get('stats')
  stats() {
    return this.usersService.stats();
  }
}
