import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { AUTH_SERVICE } from './../constants';
import { RegisterDto as UserDto } from '../dtos';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  canActivate(context: ExecutionContext): Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const jwt = request.cookies?.Authentication;

    if (!jwt) {
      throw new UnauthorizedException('No token provided');
    }

    return this.authClient
      .send<UserDto>('authenticate', { Authentication: jwt })
      .pipe(
        tap((user) => {
          request.user = user;
        }),
        map(() => true),
        catchError((err) => {
          console.error('AuthService rejected token:', err?.message || err);
          return throwError(() => new UnauthorizedException('Invalid token'));
        }),
      );
  }
}
