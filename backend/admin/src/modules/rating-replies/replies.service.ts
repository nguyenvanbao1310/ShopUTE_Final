import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

type ReplyRow = {
  id: number;
  ratingId: number;
  adminUserId: number | null;
  adminName: string | null;
  message: string;
  createdAt: Date;
};

type RawReplyRow = {
  id: number;
  ratingId: number;
  adminUserId: number | null;
  message: string;
  createdAt: Date | string;
  adminName: string | null;
};

@Injectable()
export class RepliesService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async ensureRatingExists(ratingId: number): Promise<void> {
    const rows: Array<{ id: number }> = await this.dataSource.query(
      'SELECT id FROM ratings WHERE id = ? LIMIT 1',
      [ratingId],
    );
    if (!Array.isArray(rows) || rows.length === 0) {
      throw new NotFoundException('Rating not found');
    }
  }

  async listByRating(ratingId: number): Promise<ReplyRow[]> {
    const rows: RawReplyRow[] = await this.dataSource.query(
      `SELECT rr.id, rr.ratingId, rr.adminUserId, rr.message, rr.createdAt,
              COALESCE(CONCAT(TRIM(COALESCE(u.firstName, '')),' ',TRIM(COALESCE(u.lastName, ''))), CONCAT('Admin#', rr.adminUserId)) AS adminName
         FROM rating_replies rr
         LEFT JOIN users u ON u.id = rr.adminUserId
        WHERE rr.ratingId = ?
        ORDER BY rr.createdAt DESC`,
      [ratingId],
    );

    return rows.map((r) => ({
      id: r.id,
      ratingId: r.ratingId,
      adminUserId: r.adminUserId,
      adminName: r.adminName,
      message: r.message,
      createdAt: new Date(r.createdAt),
    }));
  }

  async create(ratingId: number, adminUserId: number | null, message: string): Promise<ReplyRow> {
    await this.ensureRatingExists(ratingId);

    const resultRaw: unknown = await this.dataSource.query(
      'INSERT INTO rating_replies (ratingId, adminUserId, message) VALUES (?, ?, ?)',
      [ratingId, adminUserId, message],
    );

    const extractInsertId = (raw: unknown): number | undefined => {
      if (Array.isArray(raw)) {
        const first = raw[0] as unknown;
        if (first && typeof first === 'object' && 'insertId' in first) {
          const v = (first as Record<string, unknown>).insertId;
          return typeof v === 'number' ? v : undefined;
        }
        return undefined;
      }
      if (raw && typeof raw === 'object' && 'insertId' in raw) {
        const v = (raw as Record<string, unknown>).insertId;
        return typeof v === 'number' ? v : undefined;
      }
      return undefined;
    };

    const insertedId = extractInsertId(resultRaw);
    if (!insertedId) {
      // fallback: fetch last row for this ratingId
      const list = await this.listByRating(ratingId);
      if (list.length === 0) throw new NotFoundException('Failed to create reply');
      return list[0];
    }

    const rows: RawReplyRow[] = await this.dataSource.query(
      `SELECT rr.id, rr.ratingId, rr.adminUserId, rr.message, rr.createdAt,
              COALESCE(CONCAT(TRIM(COALESCE(u.firstName, '')),' ',TRIM(COALESCE(u.lastName, ''))), CONCAT('Admin#', rr.adminUserId)) AS adminName
         FROM rating_replies rr
         LEFT JOIN users u ON u.id = rr.adminUserId
        WHERE rr.id = ?
        LIMIT 1`,
      [insertedId],
    );
    const r = rows[0];
    return {
      id: r.id,
      ratingId: r.ratingId,
      adminUserId: r.adminUserId,
      adminName: r.adminName,
      message: r.message,
      createdAt: new Date(r.createdAt),
    };
  }

  async remove(id: number): Promise<void> {
    const raw: unknown = await this.dataSource.query('DELETE FROM rating_replies WHERE id = ?', [id]);
    let affected = 0;
    if (Array.isArray(raw)) {
      const first = raw[0] as unknown;
      if (first && typeof first === 'object' && 'affectedRows' in first) {
        const v = (first as Record<string, unknown>).affectedRows;
        if (typeof v === 'number') affected = v;
      }
    } else if (raw && typeof raw === 'object' && 'affectedRows' in raw) {
      const v = (raw as Record<string, unknown>).affectedRows;
      if (typeof v === 'number') affected = v;
    }
    if (!affected) throw new NotFoundException('Reply not found');
  }
}
