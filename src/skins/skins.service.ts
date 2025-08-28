import { Injectable } from '@nestjs/common';
import { CreateSkinDto } from './dto/create-skin.dto';
import { UpdateSkinDto } from './dto/update-skin.dto';

@Injectable()
export class SkinsService {
  create(createSkinDto: CreateSkinDto) {
    return 'This action adds a new skin';
  }

  findAll() {
    return `This action returns all skins`;
  }

  findOne(id: number) {
    return `This action returns a #${id} skin`;
  }

  update(id: number, updateSkinDto: UpdateSkinDto) {
    return `This action updates a #${id} skin`;
  }

  remove(id: number) {
    return `This action removes a #${id} skin`;
  }
}
