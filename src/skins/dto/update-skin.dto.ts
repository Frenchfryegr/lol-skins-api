import { PartialType } from '@nestjs/mapped-types';
import { CreateSkinDto } from './create-skin.dto';

export class UpdateSkinDto extends PartialType(CreateSkinDto) {}
