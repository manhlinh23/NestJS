import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { NoteModule } from './note/note.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ModuleController } from './service/module/module.controller';
import { AnimalService } from './animal/animal.service';
import { AnimalModule } from './animal.module';
import { AnimalModule } from './animal/animal.module';
import { AnimalService } from './animal/animal.service';

@Module({
  imports: [
    AuthModule,
    UserModule,
    NoteModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AnimalModule,
  ],
  controllers: [ModuleController],
  providers: [AnimalService],
})
export class AppModule {}
