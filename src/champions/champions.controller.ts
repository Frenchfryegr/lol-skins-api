import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res } from '@nestjs/common';
import { type Response } from 'express';

import { ChampionsService } from './champions.service';
import { Champion } from './entities/champion.entity';

@Controller('champions')
export class ChampionsController {
  constructor(private readonly championsService: ChampionsService) {}

  @Get()
  findAll(@Query('verbose') verbose?: boolean) {
    return this.championsService.findAll(verbose);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.championsService.findOne(+id);
  }

  @Get(':id/skins')
  findSkins(@Param('id') id: string, @Query('verbose') verbose?: boolean) {
    return this.championsService.findAllSkinsForChampion(+id, verbose);
  }


  @Get(':id/base')
  async findChampBaseSkin(@Param('id') id: string, @Res() res: Response) {
    try {
      const champId = parseInt(id);
      const imageData = await this.championsService.findChampBaseSkinArt(champId);
      
      this.setUpImageHeaders(res, imageData)
      
    } catch (error) {
      res.status(404).send(`Image not found: ${error.message}`);
    }
  }

  private setUpImageHeaders(res: Response, imageData: {data: Buffer, contentType: string}) {
    // set headers for image response and send image buffer
    res.setHeader('Content-Type', imageData.contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // 24 hours
    res.setHeader('Content-Length', imageData.data.length);
    
    res.send(imageData.data);
}

}
