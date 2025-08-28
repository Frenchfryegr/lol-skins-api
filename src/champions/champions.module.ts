import { Module } from '@nestjs/common';
import { ChampionsService } from './champions.service';
import { ChampionsController } from './champions.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ChampionsController],
  providers: [ChampionsService, PrismaService],
})
export class ChampionsModule {}
