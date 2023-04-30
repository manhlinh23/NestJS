import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDTO } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(data: AuthDTO) {
    //check duplicate email
    const existsUserEmail = await this.prismaService.user.findUnique({
      where: { email: data.email },
    });
    console.log('existsUserEmail', existsUserEmail);
    if (existsUserEmail) {
      return { msg: 'Duplicate email' };
    }
    //hashed password
    const hashedPassword = await argon.hash(data.password);
    try {
      // save data to db
      const user = await this.prismaService.user.create({
        //data save to db
        data: {
          email: data.email,
          hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
        },
        // only show 4 fields when return user
        select: {
          id: true,
          email: true,
          lastName: true,
          createdAt: true,
        },
      });
      return {
        user,
        message: 'Register success',
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('Email is exists');
      }
    }
  }

  async login(data: AuthDTO) {
    // find user
    const user = await this.prismaService.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    // compare password
    const matchedPassword = await argon.verify(
      user.hashedPassword,
      data.password,
    );

    if (!matchedPassword) {
      throw new ForbiddenException('Password not match');
    }

    //hide field hashedPassword to client, not affect to db
    delete user.hashedPassword;

    return await this.signJwt(user.id, user.email);
  }

  async signJwt(
    userId: number,
    email: string,
  ): Promise<{ accessToken: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const jwtString = await this.jwtService.signAsync(payload, {
      expiresIn: '10m',
      secret: this.configService.get('JWT_SECRET'),
    });

    return {
      accessToken: jwtString,
    };
  }
}
