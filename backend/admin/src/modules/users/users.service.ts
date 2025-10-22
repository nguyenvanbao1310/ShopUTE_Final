import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

type UserRow = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  isActive: 0 | 1 | boolean;
};

type RawCountRow = { c: number | string };
type RawUserRow = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  isActive?: number | boolean;
};

@Injectable()
export class UsersService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private async hasIsActiveColumn(): Promise<boolean> {
    const rows: RawCountRow[] = await this.dataSource.query(
      `SELECT COUNT(*) AS c
         FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'users'
          AND COLUMN_NAME = 'isActive'`,
    );
    const c = Number(rows?.[0]?.c ?? 0);
    return Number.isFinite(c) && c > 0;
  }

  async listAll(): Promise<Array<Omit<UserRow, 'isActive'> & { isActive: boolean }>> {
    const has = await this.hasIsActiveColumn();
    const sql = has
      ? `SELECT id, email, firstName, lastName, phone, role, createdAt, updatedAt, isActive
           FROM users
          ORDER BY createdAt DESC`
      : `SELECT id, email, firstName, lastName, phone, role, createdAt, updatedAt
           FROM users
          ORDER BY createdAt DESC`;
    const rows: RawUserRow[] = await this.dataSource.query(sql);
    return rows.map((r: RawUserRow) => ({
      id: r.id,
      email: r.email,
      firstName: r.firstName,
      lastName: r.lastName,
      phone: r.phone,
      role: r.role,
      createdAt: new Date(r.createdAt as string | number | Date),
      updatedAt: new Date(r.updatedAt as string | number | Date),
      isActive: has ? (typeof r.isActive === 'boolean' ? r.isActive : r.isActive === 1) : true,
    }));
  }

  async updateStatus(id: number, isActive: boolean): Promise<void> {
    const has = await this.hasIsActiveColumn();
    if (!has) {
      throw new BadRequestException(
        "Column 'isActive' does not exist on users table. Please add it: ALTER TABLE users ADD COLUMN isActive TINYINT(1) NOT NULL DEFAULT 1;",
      );
    }
    const raw: unknown = await this.dataSource.query('UPDATE users SET isActive = ? WHERE id = ?', [isActive ? 1 : 0, id]);
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
    if (!affected) throw new NotFoundException('User not found');
  }

  async search(filters: {
    name?: string;
    role?: string;
    isActive?: boolean;
  }): Promise<Array<Omit<UserRow, 'isActive'> & { isActive: boolean }>> {
    const has = await this.hasIsActiveColumn();
    const where: string[] = [];
    const params: any[] = [];

    if (filters.name && filters.name.trim()) {
      const term = `%${filters.name.trim()}%`;
      // Use LOWER for case-insensitive matching
      where.push(
        "(LOWER(CONCAT(TRIM(COALESCE(firstName,'')),' ',TRIM(COALESCE(lastName,'')))) LIKE LOWER(?) OR LOWER(firstName) LIKE LOWER(?) OR LOWER(lastName) LIKE LOWER(?) OR LOWER(email) LIKE LOWER(?))",
      );
      params.push(term, term, term, term);
    }

    if (filters.role) {
      const r = String(filters.role).toLowerCase();
      if (r === 'admin' || r === 'user') {
        where.push('role = ?');
        params.push(r);
      }
    }

    if (typeof filters.isActive === 'boolean') {
      if (!has) {
        throw new BadRequestException(
          "Column 'isActive' does not exist on users table. Please add it before filtering.",
        );
      }
      where.push('isActive = ?');
      params.push(filters.isActive ? 1 : 0);
    }

    const selectBase = has
      ? 'SELECT id, email, firstName, lastName, phone, role, createdAt, updatedAt, isActive FROM users'
      : 'SELECT id, email, firstName, lastName, phone, role, createdAt, updatedAt FROM users';

    const sql = [
      selectBase,
      where.length ? `WHERE ${where.join(' AND ')}` : '',
      'ORDER BY createdAt DESC',
    ]
      .filter(Boolean)
      .join(' ');

    const rows: RawUserRow[] = await this.dataSource.query(sql, params);
    return rows.map((r: RawUserRow) => ({
      id: r.id,
      email: r.email,
      firstName: r.firstName,
      lastName: r.lastName,
      phone: r.phone,
      role: r.role,
      createdAt: new Date(r.createdAt as string | number | Date),
      updatedAt: new Date(r.updatedAt as string | number | Date),
      isActive: has ? (typeof r.isActive === 'boolean' ? r.isActive : r.isActive === 1) : true,
    }));
  }
}
