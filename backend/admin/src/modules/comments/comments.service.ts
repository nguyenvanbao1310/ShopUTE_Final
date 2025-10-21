import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

type FlaggedComment = {
  id: number;
  productId: number;
  productName: string;
  userId: number | null;
  userName: string;
  userActive: boolean;
  rating: number;
  comment: string | null;
  containsProfanity: boolean;
  createdAt: Date;
  reason: string;
};

type RawRow = {
      id: number;
      productId: number;
      productName: string | null;
      userId: number | null;
      userActive: 0 | 1 | boolean;
      rating: string | number;
      comment: string | null;
      containsProfanity: 0 | 1 | boolean;
      createdAt: Date | string;
      userName: string;
    };

@Injectable()
export class CommentsService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findFlagged(limit?: number): Promise<FlaggedComment[]> {
    const params: any[] = [];
    let sql = `
      SELECT 
        r.id AS id,
        r.productId AS productId,
        r.userId AS userId,
        CAST(r.rating AS DECIMAL(3,1)) AS rating,
        r.comment AS comment,
        r.containsProfanity AS containsProfanity,
        r.createdAt AS createdAt,
        COALESCE(p.name, CONCAT('Product#', r.productId)) AS productName,
        COALESCE(CONCAT(TRIM(COALESCE(u.firstName, '')), ' ', TRIM(COALESCE(u.lastName, ''))), CONCAT('User#', r.userId)) AS userName,
        (u.id IS NOT NULL) AS userActive
      FROM ratings r
      LEFT JOIN users u ON u.id = r.userId
      LEFT JOIN products p ON p.id = r.productId
      WHERE (r.rating < 3) OR (r.containsProfanity = 1)
      ORDER BY r.createdAt DESC`;
    if (typeof limit === 'number' && Number.isFinite(limit) && limit > 0) {
      sql += ' LIMIT ?';
      params.push(Math.floor(limit));
    }

    const rows: RawRow[] = await this.dataSource.query(sql, params);

    return rows.map((r) => {
      const ratingNum = Number(r.rating);
      const prof = typeof r.containsProfanity === 'boolean' ? r.containsProfanity : r.containsProfanity === 1;
      const reasons: string[] = [];
      if (ratingNum < 3) reasons.push('đánh giá thấp');
      if (prof) reasons.push('có ngôn từ thô tục');
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
