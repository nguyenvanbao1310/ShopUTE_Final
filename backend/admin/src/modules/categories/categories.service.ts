import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    // Trả về tất cả category, có thể include children
    return this.categoryRepo.find({
      select: ['id', 'name'],
      order: { id: 'ASC' },
    });
  }

  findOne(id: number) {
    return this.categoryRepo.findOneBy({ id });
  }
}
