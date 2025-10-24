import { IsBoolean, IsDate, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Min } from 'class-validator';

export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  code: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  userId?: number | null;

  @IsEnum(['PERCENT', 'AMOUNT'] as const)
  type: 'PERCENT' | 'AMOUNT';

  @IsNotEmpty()
  @IsNumber()
  value: number;

  @IsOptional()
  @IsNumber()
  minOrderAmount?: number | null;

  @IsOptional()
  @IsNumber()
  maxDiscountValue?: number | null;

  @IsOptional()
  @IsDate()
  expiresAt?: Date | null;

  @IsOptional()
  @IsBoolean()
  isUsed?: boolean;

  @IsOptional()
  @IsDate()
  usedAt?: Date | null;
}
