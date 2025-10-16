import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  stock?: number;

  @IsOptional()
  @IsEnum(['ACTIVE', 'INACTIVE'])
  status?: 'ACTIVE' | 'INACTIVE';

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsNumber()
  categoryId: number;

  @IsString()
  brand: string;

  @IsString()
  cpu: string;

  @IsString()
  ram: string;

  @IsString()
  storage: string;

  @IsString()
  gpu: string;

  @IsString()
  screen: string;
}
