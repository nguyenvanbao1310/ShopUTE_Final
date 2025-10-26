import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { RepliesService } from './replies.service';
import { AdminGuard } from '../../shared/guards/admin.guard';
import { CreateReplyDto } from './dto/create-reply.dto';

@Controller('ratings')
// @UseGuards(AdminGuard)
export class RepliesController {
  constructor(private readonly repliesService: RepliesService) {}

  @Get(':ratingId/replies')
  list(@Param('ratingId', ParseIntPipe) ratingId: number) {
    return this.repliesService.listByRating(ratingId);
  }

  @UseGuards(AdminGuard)
  @Post(':ratingId/replies')
  create(
    @Param('ratingId', ParseIntPipe) ratingId: number,
    @Body() dto: CreateReplyDto,
    @Req() req: Request & { user?: { sub?: number } },
  ) {
    const adminUserId: number | null = typeof req.user?.sub === 'number' ? (req.user!.sub as number) : null;
    return this.repliesService.create(ratingId, adminUserId, dto.message);
  }
  
  @UseGuards(AdminGuard)
  @Delete('replies/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.repliesService.remove(id);
  }
}
