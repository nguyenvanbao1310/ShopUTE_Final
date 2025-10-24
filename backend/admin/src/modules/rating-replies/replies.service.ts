import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReplyRow } from './types/replyRow.type';
import { RawReplyRow } from './types/rawReplyRow.type';
import { Reply } from './entities/reply.entity';
import { Rating } from '../comments/entities/rating.entity';
import { User } from '../users/entities/user.entity';

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
    const rows = await this.replyRepo
      .createQueryBuilder('rr')
      .leftJoin(User, 'u', 'u.id = rr.adminUserId')
      .where('rr.ratingId = :ratingId', { ratingId })
      .select([
        'rr.id AS id',
        'rr.ratingId AS ratingId',
        'rr.adminUserId AS adminUserId',
        'rr.message AS message',
        'rr.createdAt AS createdAt',
        "COALESCE(CONCAT(TRIM(COALESCE(u.firstName, '')), ' ', TRIM(COALESCE(u.lastName, ''))), CONCAT('Admin#', rr.adminUserId)) AS adminName",
      ])
      .orderBy('rr.createdAt', 'DESC')
      .getRawMany<RawReplyRow>();

    return rows.map(this.mapRawToRow);
  }

  async create(ratingId: number, adminUserId: number | null, message: string): Promise<ReplyRow> {
    await this.ensureRatingExists(ratingId);

    const saved = await this.replyRepo.save({ ratingId, adminUserId, message });

    const row = await this.replyRepo
      .createQueryBuilder('rr')
      .leftJoin(User, 'u', 'u.id = rr.adminUserId')
      .where('rr.id = :id', { id: saved.id })
      .select([
        'rr.id AS id',
        'rr.ratingId AS ratingId',
        'rr.adminUserId AS adminUserId',
        'rr.message AS message',
        'rr.createdAt AS createdAt',
        "COALESCE(CONCAT(TRIM(COALESCE(u.firstName, '')), ' ', TRIM(COALESCE(u.lastName, ''))), CONCAT('Admin#', rr.adminUserId)) AS adminName",
      ])
      .getRawOne<RawReplyRow>();

    if (!row) throw new NotFoundException('Failed to create reply');
    return this.mapRawToRow(row);
  }

  async remove(id: number): Promise<void> {
    const res = await this.replyRepo.delete(id);
    if (!res.affected) throw new NotFoundException('Reply not found');
  }

  private mapRawToRow = (r: RawReplyRow): ReplyRow => ({
    id: r.id,
    ratingId: r.ratingId,
    adminUserId: r.adminUserId,
    adminName: r.adminName,
    message: r.message,
    createdAt: new Date(r.createdAt),
  });
}
