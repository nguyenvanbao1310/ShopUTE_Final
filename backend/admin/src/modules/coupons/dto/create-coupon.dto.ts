import { IsBoolean, IsDateString, IsEnum, IsInt, IsNotEmpty, IsNumberString, IsOptional, IsPositive, IsString, Length, Min } from 'class-validator';

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

  // Accept numeric string to preserve decimals
  @IsNotEmpty()
  @IsNumberString()
  value: string;

  @IsOptional()
  @IsNumberString()
  minOrderAmount?: string | null;

  @IsOptional()
  @IsNumberString()
  maxDiscountValue?: string | null;

  @IsOptional()
  @IsDateString()
  expiresAt?: string | null;

  @IsOptional()
  @IsBoolean()
  isUsed?: boolean;

  @IsOptional()
  @IsDateString()
  usedAt?: string | null;
}
