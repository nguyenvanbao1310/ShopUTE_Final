import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepliesController } from './replies.controller';
import { RepliesService } from './replies.service';
import { Reply } from './entities/reply.entity';
import { Rating } from '../comments/entities/rating.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reply, Rating, User])],
  controllers: [RepliesController],
  providers: [RepliesService],
})
export class RepliesModule {}
