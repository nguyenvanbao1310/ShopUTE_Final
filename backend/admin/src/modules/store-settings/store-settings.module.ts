import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreSettingsController } from './store-settings.controller';
import { StoreSettingsService } from './store-settings.service';
import { User } from '../users/entities/user.entity'; // ✅ import entity User

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // ✅ cung cấp UserRepository cho module này
  ],
  controllers: [StoreSettingsController],
  providers: [StoreSettingsService],
  exports: [StoreSettingsService],
})
export class StoreSettingsModule {}
