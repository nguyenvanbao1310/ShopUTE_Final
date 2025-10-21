// admin.guard.ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import jwt, { JwtPayload } from 'jsonwebtoken';
import type { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<Request & { user?: (JwtPayload & { role?: string; sub?: number }) }>();

    // Allow dev header as fallback
    const devRole = (req.headers['x-role'] as string | undefined)?.toUpperCase();
    if (devRole === 'ADMIN') return true;

    const auth = req.header('authorization');
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing Bearer token');
    }
    const token = auth.slice('Bearer '.length).trim();
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      if (typeof decoded !== 'object' || decoded === null) {
        throw new UnauthorizedException('Invalid token payload');
      }
      const payload = decoded as JwtPayload & { role?: string };
      const role = (payload.role || '').toUpperCase();
      if (role !== 'ADMIN') {
        throw new ForbiddenException('Admin role required');
      }
      req.user = payload;
      return true;
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
