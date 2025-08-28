import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChampionsService } from './champions.service';
import { CreateChampionDto } from './dto/create-champion.dto';
import { UpdateChampionDto } from './dto/update-champion.dto';

@Controller('champions')
export class ChampionsController {
  constructor(private readonly championsService: ChampionsService) {}

  @Post()
  create(@Body() createChampionDto: CreateChampionDto) {
    return this.championsService.create(createChampionDto);
  }

  @Get()
  findAll() {
    return this.championsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.championsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChampionDto: UpdateChampionDto) {
    return this.championsService.update(+id, updateChampionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.championsService.remove(+id);
  }
}
