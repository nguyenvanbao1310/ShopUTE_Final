import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateReplyDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 1000)
  message!: string;
}

