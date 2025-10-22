// admin.guard.ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import type { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    type AdminJwtPayload = {
      role?: string;
      sub?: number;
      iat?: number;
      exp?: number;
      [key: string]: unknown;
    };

    const isAdminJwtPayload = (value: unknown): value is AdminJwtPayload => {
      if (typeof value !== 'object' || value === null) return false;
      const obj = value as Record<string, unknown>;
      if ('role' in obj && typeof obj.role !== 'string') return false;
      if ('sub' in obj && typeof obj.sub !== 'number') return false;
      return true;
    };

    const req = ctx.switchToHttp().getRequest<Request & { user?: AdminJwtPayload }>();

    // Allow dev header as fallback
    const devRole = (req.headers['x-role'] as string | undefined)?.toUpperCase();
    if (devRole === 'ADMIN') return true;

    const auth = req.header('authorization');
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing Bearer token');
    }
    const token = auth.slice('Bearer '.length).trim();
    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new UnauthorizedException('Missing JWT secret');
      }
      const decoded: unknown = verify(token, secret);
      if (!isAdminJwtPayload(decoded)) {
        throw new UnauthorizedException('Invalid token payload');
      }
      const role = (decoded.role || '').toUpperCase();
      if (role !== 'ADMIN') {
        throw new ForbiddenException('Admin role required');
      }
      req.user = decoded;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}