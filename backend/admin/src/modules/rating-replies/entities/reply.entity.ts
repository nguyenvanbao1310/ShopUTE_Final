import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('rating_replies')
@Index('idx_rating_replies_rating_time', ['ratingId', 'createdAt'])
export class Reply {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', unsigned: true })
  ratingId: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  adminUserId: number | null;

  @Column({ type: 'text' })
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

