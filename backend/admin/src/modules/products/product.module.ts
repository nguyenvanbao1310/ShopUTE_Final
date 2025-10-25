import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductImageController } from './productImage.controller';
import { ProductImageService } from './productImage.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductImage])],
  controllers: [ProductsController, ProductImageController],
  providers: [ProductsService, ProductImageService],
})
export class ProductsModule {}
