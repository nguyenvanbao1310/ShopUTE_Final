import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepliesController } from './replies.controller';
import { RepliesService } from './replies.service';
import { Reply } from './entities/reply.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reply])],
  controllers: [RepliesController],
  providers: [RepliesService],
})
export class RepliesModule {}
