import { AuthGuard } from '@nestjs/passport';

// divive guard
export class MyJwt extends AuthGuard('jwt') {}
