import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AdminGuard } from '../../shared/guards/admin.guard';

@Controller('comments')
@UseGuards(AdminGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // GET /api/comments/flagged?limit=50
  @Get('flagged')
  async getFlagged(@Query('limit') limit?: string) {
    const n = limit ? Number(limit) : undefined;
    return this.commentsService.findFlagged(n);
  }
}

