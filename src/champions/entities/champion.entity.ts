import { Skin } from "src/skins/entities/skin.entity"

export class Champion {
    id: number
    name: string
    alias: string
    title: string
    shortBio?: string
    roles: string[]
    tacticalInfo?: any
    playstyleInfo?: any
    championTagInfo?: any
    assets?: any
    passive?: any
    spells?: any
    skins: Skin[]
}
