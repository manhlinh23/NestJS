import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
    authService.doSomething();
  }

  @Post('register')
  //   register(@Req() request: Request) {
  register(@Body() body: AuthDTO) {
    //body's type must be a "Data Transfer object" - DTO
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: AuthDTO) {
    return this.authService.login(body);
  }
}
