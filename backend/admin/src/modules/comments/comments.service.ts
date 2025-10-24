import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { FlaggedComment } from './types/flaggedComment.type';
import { RawRow } from './types/rawRow.type';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepo: Repository<Rating>,
  ) {}

  async findFlagged(limit?: number): Promise<FlaggedComment[]> {
    const qb = this.ratingRepo
      .createQueryBuilder('r')
      .leftJoin(User, 'u', 'u.id = r.userId')
      .leftJoin(Product, 'p', 'p.id = r.productId')
      .where('(r.rating < :min) OR (r.containsProfanity = :prof)', { min: 3, prof: true })
      .select([
        'r.id AS id',
        'r.productId AS productId',
        'r.userId AS userId',
        'r.rating AS rating',
        'r.comment AS comment',
        'r.containsProfanity AS containsProfanity',
        'r.createdAt AS createdAt',
        "COALESCE(p.name, CONCAT('Product#', r.productId)) AS productName",
        "COALESCE(CONCAT(TRIM(COALESCE(u.firstName, '')), ' ', TRIM(COALESCE(u.lastName, ''))), CONCAT('User#', r.userId)) AS userName",
        '(u.id IS NOT NULL) AS userActive',
      ])
      .orderBy('r.createdAt', 'DESC');

    if (typeof limit === 'number' && Number.isFinite(limit) && limit > 0) {
      qb.limit(Math.floor(limit));
    }

    const rows = await qb.getRawMany<RawRow>();

    return rows.map((r) => {
      const ratingNum = Number(r.rating);
      const prof = typeof r.containsProfanity === 'boolean' ? r.containsProfanity : r.containsProfanity === 1;
      const reasons: string[] = [];
      if (ratingNum < 3) reasons.push('Đánh giá thấp');
      if (prof) reasons.push('Có ngôn từ thô tục');
      return {
        id: r.id,
        productId: r.productId,
        productName: r.productName ?? `Product#${r.productId}`,
        userId: r.userId ?? null,
        userName: r.userName,
        userActive: typeof r.userActive === 'boolean' ? r.userActive : r.userActive === 1,
        rating: ratingNum,
        comment: r.comment ?? null,
        containsProfanity: prof,
        createdAt: new Date(r.createdAt),
        reason: reasons.join(', '),
      };
    });
  }
}
