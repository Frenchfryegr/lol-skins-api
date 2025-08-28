import { Module } from '@nestjs/common';
import { SkinsService } from './skins.service';
import { SkinsController } from './skins.controller';

@Module({
  controllers: [SkinsController],
  providers: [SkinsService],
})
export class SkinsModule {}
