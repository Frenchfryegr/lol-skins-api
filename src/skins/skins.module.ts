import { Module } from '@nestjs/common';
import { SkinsService } from './skins.service';
import { SkinsController } from './skins.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [SkinsController],
  providers: [SkinsService, PrismaService],
})
export class SkinsModule {}
