import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SkinsService } from './skins.service';
import { CreateSkinDto } from './dto/create-skin.dto';
import { UpdateSkinDto } from './dto/update-skin.dto';

@Controller('skins')
export class SkinsController {
  constructor(private readonly skinsService: SkinsService) {}

  @Post()
  create(@Body() createSkinDto: CreateSkinDto) {
    return this.skinsService.create(createSkinDto);
  }

  @Get()
  findAll() {
    return this.skinsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.skinsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSkinDto: UpdateSkinDto) {
    return this.skinsService.update(+id, updateSkinDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.skinsService.remove(+id);
  }
}
