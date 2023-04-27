import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // this module can be use globally
@Module({
  providers: [PrismaService],
  exports: [PrismaService], //other modules can use Prisma Service
})
export class PrismaModule {}
