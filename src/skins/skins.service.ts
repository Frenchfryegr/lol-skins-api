import { Injectable } from '@nestjs/common';
import { Skin } from './entities/skin.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SkinsService {
  constructor(private prismaService: PrismaService) {}

  create(skin: Skin) {
    return 'This action adds a new skin';
  }

  findAll() {
    return this.prismaService.findAllSkins();
  }

  findSkinSplashArt(id: number) {
    return "WIP";
    // return this.prismaService.findSkinTileArt(id)
  }

  findSkinTileArt(id: number) {
    return this.prismaService.findSkinTileArt(id)
  }

  findChampBaseSkinArt(champId: number) {
    return this.prismaService.findChampBaseSkinArt(champId)
  }

  findOne(id: number) {
    return this.prismaService.findSkin(id);
  }

  update(id: number, skin: Skin) {
    return `This action updates a #${id} skin`;
  }

  remove(id: number) {
    return `This action removes a #${id} skin`;
  }
}
