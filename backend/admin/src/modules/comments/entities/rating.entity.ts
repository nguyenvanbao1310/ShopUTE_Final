import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('ratings')
export class Rating {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  productId!: number;

  @Column({ type: 'int', nullable: true })
  userId!: number | null;

  // stored in DB as DECIMAL(3,1) or similar
  @Column({ type: 'decimal', precision: 3, scale: 1 })
  rating!: string; // keep as string per TypeORM default for decimals

  @Column({ type: 'text', nullable: true })
  comment!: string | null;

  @Column({ type: 'boolean', default: false })
  containsProfanity!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

