import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Rating } from '../../comments/entities/rating.entity';

@Entity('rating_replies')
@Index('idx_rating_replies_rating_time', ['ratingId', 'createdAt'])
export class Reply {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', unsigned: true })
  ratingId: number;

  @ManyToOne(() => Rating, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ratingId' })
  rating: Rating;

  @Column({ type: 'int', unsigned: true, nullable: true })
  adminUserId: number | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'adminUserId' })
  adminUser?: User | null;

  @Column({ type: 'text' })
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
