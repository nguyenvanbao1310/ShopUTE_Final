import { Injectable, NotFoundException } from '@nestjs/common';
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

  async remove(id: number) {
    const image = await this.productImageRepository.findOne({ where: { id } });
    if (!image) {
      throw new NotFoundException('Ảnh không tồn tại');
    }

    await this.productImageRepository.remove(image);
    return { message: 'Xóa ảnh thành công', id };
  }
}
