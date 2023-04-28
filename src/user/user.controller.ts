import { Body, Controller, Get, Req, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { MyJwt } from 'src/auth/guard';

@Controller('users')
export class UserController {
  // variable inside AuthGuard is the same with strategy
  // if have jwt -> next step
  //   @UseGuards(AuthGuard('jwt'))
  // using guard custom
  @UseGuards(MyJwt)
  @Get('me')
  // @GetUser() is custom decarator -> auto get user from url
  me(@GetUser() user: User) {
    try {
      return user;
    } catch (error) {
      console.log('error', error);
    }
  }
}
