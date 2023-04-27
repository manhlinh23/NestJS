import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO } from './dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}
  doSomething() {
    console.log('doSomehing');
  }

  async register(data: AuthDTO) {
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
      return user;
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

    return user;
  }
}
