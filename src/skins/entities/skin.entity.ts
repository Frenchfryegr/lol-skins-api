import { Champion } from "src/champions/entities/champion.entity"
import { Chroma } from "./chroma.entity"
import { SkinLine } from "./skinline.entity"
export class Skin {
    id: number
    championId: number
    champion: Champion
    contentId?: string
    isBase: boolean
    name: string
    skinClassification?: string
    rarity?: string
    isLegacy?: boolean
    splashPath?: string
    uncenteredSplashPath?: string
    tilePath?: string
    loadScreenPath?: string
    loadScreenVintagePath?: string
    skinType?: string
    splashVideoPath?: string
    previewVideoUrl?: string
    collectionSplashVideoPath?: string
    collectionCardHoverVideoPath?: string
    featuresText?: string
    chromaPath?: string
    emblems?: any
    regionRarityId?: number
    rarityGemPath?: string
    description?: string
  }
  