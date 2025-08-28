import { Injectable } from '@nestjs/common';
import { CreateChampionDto } from './dto/create-champion.dto';
import { UpdateChampionDto } from './dto/update-champion.dto';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class ChampionsService {

  constructor( private prismaService: PrismaService) {}

  create(createChampionDto: CreateChampionDto) {
    return this.prismaService.createChampion(createChampionDto);
  }

  findAll() {
    return this.prismaService.findAllChampions();
  }

  findOne(id: number) {
    return this.prismaService.findChampion(id);
  }

  update(id: number, updateChampionDto: UpdateChampionDto) {
    return `This action updates a #${id} champion`;
  }

  remove(id: number) {
    return `This action removes a #${id} champion`;
  }
}
