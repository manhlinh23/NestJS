import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(configService: ConfigService) {
    super({
      datasources: {
        db: {
          //  url: 'postgresql://postgres:123456aA@localhost:5432/testdb?schema=public',
          url: configService.get('DATABASE_URL'),
        },
      },
    });
  }
}
