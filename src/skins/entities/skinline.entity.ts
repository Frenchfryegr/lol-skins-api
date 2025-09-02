import { Skin } from './skin.entity';

export class SkinLine {
  id: number;
  name?: string;
  description?: string;
  skins?: Skin[];
}
