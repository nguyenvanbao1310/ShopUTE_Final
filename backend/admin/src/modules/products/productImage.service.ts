import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductImage } from './entities/product-image.entity';

@Injectable()
export class ProductImageService {
  constructor(
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) {}

  async findAll(): Promise<ProductImage[]> {
    return this.productImageRepository.find();
  }

  async findByProductId(productId: number): Promise<ProductImage[]> {
    return this.productImageRepository.find({
      where: { productId },
      order: { position: 'ASC' }, // sắp xếp theo thứ tự nếu có
    });
  }
}
