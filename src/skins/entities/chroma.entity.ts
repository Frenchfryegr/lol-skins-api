import { Skin } from "./skin.entity"

export class Chroma {
    id: number
    skinId: number
    skin: Skin
    name?: string
    contentId?: string
    skinClassification?: string
    chromaPath?: string
    tilePath?: string
    colors: string[]        // hex codes
    descriptions?: any
    description?: string
    rarities?: any
  }