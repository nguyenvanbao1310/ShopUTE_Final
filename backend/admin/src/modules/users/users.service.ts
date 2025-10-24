import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}
  
  async listAll(): Promise<User[]> {
    return this.userRepo.find({ order: { createdAt: 'DESC' } });
  }

  async updateStatus(id: number, isActive: boolean): Promise<void> {
    const res = await this.userRepo.update({ id }, { isActive });
    if (!res.affected) {
      throw new NotFoundException('User not found');
    }
  }

  async search(filters: {
    name?: string;
    role?: string;
    isActive?: boolean;
  }): Promise<User[]> {
    const qb = this.userRepo
      .createQueryBuilder('u')
      .orderBy('u.createdAt', 'DESC');

    if (filters.name && filters.name.trim()) {
      const term = `%${filters.name.trim()}%`;
      qb.andWhere('(u.firstName LIKE :term OR u.lastName LIKE :term OR u.email LIKE :term)', { term });
    }

    if (filters.role) {
      const r = String(filters.role).toLowerCase();
      if (r === 'admin' || r === 'user') qb.andWhere('u.role = :role', { role: r });
    }

    if (typeof filters.isActive === 'boolean') {
      qb.andWhere('u.isActive = :isActive', { isActive: filters.isActive });
    }

    return qb.getMany();
  }

  async stats(): Promise<{ total: number; active: number; banned: number }> {
    const [total, active, banned] = await Promise.all([
      this.userRepo.count(),
      this.userRepo.count({ where: { isActive: true } }),
      this.userRepo.count({ where: { isActive: false } }),
    ]);
    return { total, active, banned };
  }

  async findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  async create(data: Partial<User>) {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }

  async findById(id: number) {
    return this.userRepo.findOne({ where: { id } });
  }
  async save(user: User): Promise<User> {
    return this.userRepo.save(user);
  }
}
