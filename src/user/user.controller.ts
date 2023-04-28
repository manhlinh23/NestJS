import { Body, Controller, Get, Req, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MyJwt } from 'src/auth/guard';

@Controller('users')
export class UserController {
  // variable inside AuthGuard is the same with strategy
  // if have jwt -> next step
  //   @UseGuards(AuthGuard('jwt'))
  // using guard custom
  @UseGuards(MyJwt)
  @Get('me')
  me(@Req() request: any) {
    try {
      return request.user;
    } catch (error) {
      console.log('error', error);
    }
  }
}
