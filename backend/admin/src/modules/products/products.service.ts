import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductImage } from './entities/product-image.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(ProductImage)
    private productImageRepository: Repository<ProductImage>,
  ) {}

  findAll() {
    return this.productRepo.find();
  }

  findOne(id: number) {
    return this.productRepo.findOneBy({ id });
  }

  async create(createProductDto: CreateProductDto) {
    const { imageUrls, ...productData } = createProductDto;

    // 1️⃣ Lưu product
    const savedProduct = await this.productRepo.save(productData);

    // 2️⃣ Nếu có ảnh phụ -> lưu vào bảng product_images
    if (imageUrls && imageUrls.length > 0) {
      const productImages = imageUrls.map((url, index) =>
        this.productImageRepository.create({
          url,
          position: index + 1,
          product: savedProduct,
        }),
      );
      await this.productImageRepository.save(productImages);
    }

    return savedProduct;
  }

  async update(id: number, data: UpdateProductDto) {
    await this.productRepo.update(id, data);
    return this.productRepo.findOneBy({ id });
  }

  delete(id: number) {
    return this.productRepo.delete(id);
  }
}
