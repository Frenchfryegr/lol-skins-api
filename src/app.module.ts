import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SkinsModule } from './skins/skins.module';
import { ChampionsModule } from './champions/champions.module';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [SkinsModule, ChampionsModule, PrismaClient],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
