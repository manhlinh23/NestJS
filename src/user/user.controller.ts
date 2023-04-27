import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  me() {
    try {
      return 'My detail info';
    } catch (error) {
      console.log('error', error);
    }
  }
}
