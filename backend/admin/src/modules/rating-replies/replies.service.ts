import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReplyRow } from './types/replyRow.type';
import { Reply } from './entities/reply.entity';
import { Rating } from '../comments/entities/rating.entity';

@Injectable()
export class RepliesService {
  constructor(
    @InjectRepository(Reply)
    private readonly replyRepo: Repository<Reply>,
    @InjectRepository(Rating)
    private readonly ratingRepo: Repository<Rating>,
  ) {}

  async ensureRatingExists(ratingId: number): Promise<void> {
    const exists = await this.ratingRepo.exist({ where: { id: ratingId } });
    if (!exists) throw new NotFoundException('Rating not found');
  }

  async listByRating(ratingId: number): Promise<ReplyRow[]> {
    const replies = await this.replyRepo.find({
      where: { ratingId },
      relations: { adminUser: true },
      order: { createdAt: 'DESC' },
    });

    return replies.map(this.mapEntityToRow);
  }

  async create(ratingId: number, adminUserId: number | null, message: string): Promise<ReplyRow> {
    await this.ensureRatingExists(ratingId);

    const toSave = this.replyRepo.create({ ratingId, adminUserId, message });
    const saved = await this.replyRepo.save(toSave);
    const withUser = await this.replyRepo.findOne({
      where: { id: saved.id },
      relations: { adminUser: true },
    });

    if (!withUser) throw new NotFoundException('Failed to create reply');
    return this.mapEntityToRow(withUser);
  }

  async remove(id: number): Promise<void> {
    const res = await this.replyRepo.delete(id);
    if (!res.affected) throw new NotFoundException('Reply not found');
  }

  private mapEntityToRow = (reply: Reply): ReplyRow => {
    const adminName = reply.adminUser
      ? `${(reply.adminUser.firstName ?? '').trim()} ${(reply.adminUser.lastName ?? '').trim()}`.trim() || `Admin#${reply.adminUserId}`
      : reply.adminUserId != null
      ? `Admin#${reply.adminUserId}`
      : null;

    return {
      id: reply.id,
      ratingId: reply.ratingId,
      adminUserId: reply.adminUserId,
      adminName,
      message: reply.message,
      createdAt: reply.createdAt instanceof Date ? reply.createdAt : new Date(reply.createdAt),
    };
  };
}
