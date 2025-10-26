import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductImage } from './entities/product-image.entity';
import * as fs from 'fs';
import * as path from 'path';
import { Parser } from 'json2csv';
import dayjs from 'dayjs';

import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(ProductImage)
    private productImageRepository: Repository<ProductImage>,
  ) {}

  async exportToCSV(): Promise<Buffer> {
    const products = await this.productRepo.find({});

    // Chọn các trường cần export
    const fields = [
      { label: 'ID', value: 'id' },
      { label: 'Tên sản phẩm', value: 'name' },
      { label: 'Thương hiệu', value: 'brand' },
      { label: 'Giá', value: 'price' },
      { label: 'Tồn kho', value: 'stock' },
      { label: 'Lượt xem', value: 'viewCount' },
      { label: 'Trạng thái', value: 'status' },
      {
        label: 'Ngày tạo',
        value: (row) => dayjs(row.createdAt).format('DD/MM/YYYY, HH:mm:ss'),
      },
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(products);

    return Buffer.from('\uFEFF' + csv, 'utf-8'); // giữ ký tự tiếng Việt
  }

  async findAll(
    page: number,
    limit: number,
    search: string,
    sortBy: string = 'Newest',
  ): Promise<{
    data: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const where = search
      ? [
          { name: ILike(`%${search}%`) },
          { brand: ILike(`%${search}%`) },
          { description: ILike(`%${search}%`) },
        ]
      : {};

    // ✅ Xử lý sắp xếp
    let order: Record<string, 'ASC' | 'DESC'> = { id: 'ASC' };

    switch (sortBy) {
      case 'Newest':
        order = { createdAt: 'DESC' };
        break;
      case 'Oldest':
        order = { createdAt: 'ASC' };
        break;
      case 'Price: High to Low':
        order = { price: 'DESC' };
        break;
      case 'Price: Low to High':
        order = { price: 'ASC' };
        break;
      case 'Top Viewed':
        order = { viewCount: 'DESC' };
        break;
      default:
        order = { id: 'ASC' };
    }

    const [data, total] = await this.productRepo.findAndCount({
      where,
      skip,
      take: limit,
      order,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  findOne(id: number) {
    return this.productRepo.findOneBy({ id });
  }

  async create(createProductDto: CreateProductDto) {
    const { imageUrls, ...productData } = createProductDto;

    // Nếu thumbnailUrl là full URL cũ => chuyển thành relative
    if (productData.thumbnailUrl?.startsWith('http://localhost:8088/images/')) {
      productData.thumbnailUrl = productData.thumbnailUrl.replace(
        'http://localhost:8088/images/',
        'uploads/products/',
      );
    }

    const savedProduct = await this.productRepo.save(productData);

    if (imageUrls && imageUrls.length > 0) {
      const productImages = imageUrls.map((url, index) =>
        this.productImageRepository.create({
          url: url.startsWith('http')
            ? url.replace('http://localhost:8088/images/', 'uploads/products/')
            : url,
          position: index + 1,
          product: savedProduct,
        }),
      );
      await this.productImageRepository.save(productImages);
    }

    return savedProduct;
  }

  async update(id: number, body: UpdateProductDto) {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['images'],
    });

    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }
    console.log(body.removeThumbnail);

    if (body.removeThumbnail === 'true' && product.thumbnailUrl) {
      const oldPath = path.join(process.cwd(), 'public', product.thumbnailUrl);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
      product.thumbnailUrl = ''; // set null trong DB
    }

    // --- Cập nhật thumbnail ---
    if (body.thumbnailUrl) {
      product.thumbnailUrl = body.thumbnailUrl.startsWith(
        'http://localhost:8088/images/',
      )
        ? body.thumbnailUrl.replace(
            'http://localhost:8088/images/',
            'uploads/products/',
          )
        : body.thumbnailUrl;
    }

    // --- Xử lý ảnh phụ ---
    if (Array.isArray(body.imageUrls)) {
      const existingImages = await this.productImageRepository.find({
        where: { product: { id } },
      });

      // Lấy tất cả URL hiện có trong DB
      const existingUrls = existingImages.map((img) => img.url);

      // Tìm ảnh mới chưa có trong DB
      const newUrls = body.imageUrls.filter(
        (url) => !existingUrls.includes(url),
      );

      // ✅ Chỉ thêm ảnh mới, KHÔNG xoá ảnh cũ
      if (newUrls.length > 0) {
        const newImageEntities = newUrls.map((url, i) =>
          this.productImageRepository.create({
            url: url.startsWith('http')
              ? url.replace(
                  'http://localhost:8088/images/',
                  'uploads/products/',
                )
              : url,
            position: existingUrls.length + i + 1,
            product: product,
          }),
        );

        await this.productImageRepository.save(newImageEntities);
      }
    }

    // --- Cập nhật các trường text khác ---
    const { imageUrls: _imageUrls, ...productData } = body;
    Object.assign(product, productData);

    // ⚠️ Xoá quan hệ tạm để TypeORM không động tới bảng product_images
    delete (product as any).images;

    return await this.productRepo.save(product);
  }

  delete(id: number) {
    return this.productRepo.delete(id);
  }
}
