import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { AUTH_SERVICE } from './../constants';
import { RegisterDto as UserDto } from '../dtos';

@Injectable()
export class JwtAuthOrNullGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  canActivate(context: ExecutionContext): Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const jwt = request.cookies?.Authentication;

    if (!jwt) {
      request.user = { userId: null };
      return of(true);
    }

    return this.authClient
      .send<UserDto>('authenticate', { Authentication: jwt })
      .pipe(
        tap((user) => {
          // Attach either the authenticated user or null
          request.user = user || { userId: null };
        }),
        map(() => true), // Always allow request
        catchError((err) => {
          console.error('AuthService rejected token:', err?.message || err);
          request.user = { userId: null };
          return of(true); // Still allow request
        }),
      );
  }
}
