
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateChampionDto } from 'src/champions/dto/create-champion.dto';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async createChampion(data: CreateChampionDto) {
    return this.champion.create({data: data})
  }

  async findAllChampions() {
    return this.champion.findMany()
  }

  async findChampion(id: number) {
    return this.champion.findUnique({
        where: {
            id: id
        }
    })
  }
}
