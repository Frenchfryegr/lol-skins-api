import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { Champion } from './entities/champion.entity';

@Injectable()
export class ChampionsService {

  constructor( private prismaService: PrismaService) {}

  findAll(verbose: boolean = false) {
    return this.prismaService.findAllChampions(verbose);
  }

  findOne(id: number) {
    return this.prismaService.findChampion(id);
  }

  findAllSkinsForChampion(championId: number, verbose: boolean = false) {
    return this.prismaService.findAllSkinsForChampion(championId, verbose)
  }

  findChampBaseSkinArt(champId: number) {
    return this.prismaService.findChampBaseSkinArt(champId)
  }

}
