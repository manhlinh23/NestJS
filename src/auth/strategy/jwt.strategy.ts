import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
// 'jwt' is optional (when the name of file is match with the nam), nestjs can self-realization
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  // use jwt very service exclude register, login
  constructor(
    configService: ConfigService,
    protected prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }
  async validate(payload: { sub: number; email: string }) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: payload.sub,
      },
    });

    if (!user) {
      return { message: 'User not found' };
    }

    delete user.hashedPassword;

    return user;
  }
}
