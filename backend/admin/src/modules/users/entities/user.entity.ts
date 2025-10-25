import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'boolean', nullable: true })
  gender?: boolean | null;

  @Column({ type: 'date', nullable: true })
  birthday?: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar_url?: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  otp?: string | null;

  @Column({ type: 'datetime', nullable: true })
  otpExpire?: Date | null;

  @Column({
    type: 'enum',
    enum: ['user', 'admin'],
    default: 'user',
  })
  role: 'user' | 'admin';

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'int', unsigned: true, default: 0 })
  loyaltyPoints: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}