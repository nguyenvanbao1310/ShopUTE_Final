import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ProductsModule } from './modules/products/product.module';
import { OrdersModule } from './modules/orders/orders.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { CommentsModule } from './modules/comments/comments.module';
import { RepliesModule } from './modules/rating-replies/replies.module';
import { UsersModule } from './modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './modules/auth/auth.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { join } from 'path';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
    }),
    ProductsModule,
    OrdersModule,
    CouponsModule,
    NotificationsModule,
    CommentsModule,
    RepliesModule,
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
    AuthModule,
    AnalyticsModule,
    // ⚡ Serve đúng thư mục chứa ảnh
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public', 'images'), // 👉 trỏ trực tiếp vào public/images
      serveRoot: '/images', // truy cập qua /images/...
    }),
  ],
})
export class AppModule {}
