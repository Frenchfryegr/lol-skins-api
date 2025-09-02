import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { SkinsModule } from './skins/skins.module';
import { ChampionsModule } from './champions/champions.module';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from './prisma/prisma.service';
import { HttpModule } from '@nestjs/axios'; 
import { PrismaModule } from './prisma/prisma.module';

import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [SkinsModule, 
    ChampionsModule,
    PrismaClient, 
    HttpModule, 
    PrismaModule, 
    CacheModule.register({
      ttl: 3600000,
      max: 1000,
      isGlobal: true
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
