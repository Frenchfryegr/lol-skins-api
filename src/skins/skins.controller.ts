import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { type Response } from 'express';
import { SkinsService } from './skins.service';
import axios from 'axios';

import { Skin } from './entities/skin.entity';

@Controller('skins')
export class SkinsController {
  constructor(private readonly skinsService: SkinsService) {}

  @Post()
  create(@Body() skin: Skin) {
    return this.skinsService.create(skin);
  }

  @Get()
  findAll() {
    return this.skinsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.skinsService.findOne(+id);
  }

  @Get(':id/splash')
  findSkinSplash(@Param('id') id: string) {
    return this.skinsService.findSkinSplashArt(+id)
  }

  @Get(':id/tile')
  async findSkinTile(@Param('id') id: string, @Res() res: Response) {
    try {
      const skinId = parseInt(id);
      const imageData = await this.skinsService.findSkinTileArt(skinId);
      
      this.setUpImageHeaders(res, imageData)
      
    } catch (error) {
      res.status(404).send('Image not found');
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() skin: Skin) {
    return this.skinsService.update(+id, skin);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.skinsService.remove(+id);
  }

  private setUpImageHeaders(res: Response, imageData: {data: Buffer, contentType: string}) {
      // set headers for image response and send image buffer
      res.setHeader('Content-Type', imageData.contentType);
      res.setHeader('Cache-Control', 'public, max-age=86400'); // 24 hours
      res.setHeader('Content-Length', imageData.data.length);
      
      res.send(imageData.data);
  }
}
