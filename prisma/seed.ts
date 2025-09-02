// prisma/seed.ts
import { PrismaClient, Prisma } from '@prisma/client'
import axios from 'axios'

const prisma = new PrismaClient()

function toCDragonUrl(assetPath: string | null): string | null {
    if (!assetPath) return null;
    
    const CDRAGON_BASE = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/';
    const stripped = assetPath.replace(/^\/?lol-game-data\/assets\//i, '');
    return CDRAGON_BASE + stripped.toLowerCase();
}

async function seedSkinLines() {
  const { data } = await axios.get(
    'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/skinlines.json'
  )
  await prisma.skinLine.createMany({
    data: (data as any[]).map((skinline) => ({
      id: skinline.id,
      name: skinline.name ?? null,
      description: skinline.description ?? null,
    })),
    skipDuplicates: true,
  })
}

async function main() {
  await seedSkinLines()

  //seed champs from champid 1 to 1000
  for (let champId = 1; champId <= 1000; champId++) {
    try {
      const { data: data } = await axios.get(
        `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champions/${champId}.json`
      )

      const championData = data as any

      const skinsCreate: Prisma.SkinCreateWithoutChampionInput[] = (championData.skins ?? []).map((skin: any) => {
        const chromasCreate = (skin.chromas ?? []).map((champion: any) => ({
          id: champion.id,
          name: champion.name ?? null,
          contentId: champion.contentId ?? null,
          skinClassification: champion.skinClassification ?? null,
          chromaPath: toCDragonUrl(champion.chromaPath), 
          tilePath: toCDragonUrl(champion.tilePath), 
          colors: (champion.colors ?? []) as string[],
          descriptions: champion.descriptions ?? null, 
          description: champion.description ?? null,
          rarities: champion.rarities ?? null, 
        }))


        const skinLineIds: number[] = (skin.skinLines ?? []).map((sl: any) => sl.id)
        const skinLines =
          skinLineIds.length > 0 ? { connect: skinLineIds.map((id) => ({ id })) } : undefined

        return {
          id: skin.id,
          contentId: skin.contentId ?? null,
          isBase: !!skin.isBase,
          name: skin.name ?? null,
          skinClassification: skin.skinClassification ?? null,
          splashPath: toCDragonUrl(skin.splashPath),
          uncenteredSplashPath: toCDragonUrl(skin.uncenteredSplashPath),
          tilePath: toCDragonUrl(skin.tilePath),
          loadScreenPath: toCDragonUrl(skin.loadScreenPath),
          loadScreenVintagePath: toCDragonUrl(skin.loadScreenVintagePath),
          skinType: skin.skinType ?? null,
          rarity: skin.rarity ?? null,
          isLegacy: !!skin.isLegacy,
          splashVideoPath: toCDragonUrl(skin.splashVideoPath),
          previewVideoUrl: toCDragonUrl(skin.previewVideoUrl),
          collectionSplashVideoPath: toCDragonUrl(skin.collectionSplashVideoPath),
          collectionCardHoverVideoPath: toCDragonUrl(skin.collectionCardHoverVideoPath),
          featuresText: skin.featuresText ?? null,
          chromaPath: toCDragonUrl(skin.chromaPath),
          emblems: skin.emblems ?? null, 
          regionRarityId: skin.regionRarityId ?? 0,
          rarityGemPath: toCDragonUrl(skin.rarityGemPath),
          description: skin.description ?? null,

          // relationships
          skinLines,
          chromas: chromasCreate.length ? { create: chromasCreate } : undefined,
        }
      })

      // upsert champion core fields 
      await prisma.champion.upsert({
        where: { id: championData.id as number },
        update: {
          name: championData.name,
          alias: championData.alias,
          title: championData.title,
          shortBio: championData.shortBio ?? null,
          roles: (championData.roles ?? []) as string[],
          tacticalInfo: championData.tacticalInfo ?? Prisma.JsonNull,
          playstyleInfo: championData.playstyleInfo ?? Prisma.JsonNull,
          championTagInfo: championData.championTagInfo ?? Prisma.JsonNull,
          passive: championData.passive ?? Prisma.JsonNull,
          spells: championData.spells ?? Prisma.JsonNull,
        },
        create: {
          id: championData.id,
          name: championData.name,
          alias: championData.alias,
          title: championData.title,
          shortBio: championData.shortBio ?? null,
          roles: (championData.roles ?? []) as string[],
          tacticalInfo: championData.tacticalInfo ?? Prisma.JsonNull,
          playstyleInfo: championData.playstyleInfo ?? Prisma.JsonNull,
          championTagInfo: championData.championTagInfo ?? Prisma.JsonNull,
          passive: championData.passive ?? Prisma.JsonNull,
          spells: championData.spells ?? Prisma.JsonNull,
        },
      })

      // delete existing children 
      await prisma.chroma.deleteMany({
        where: { skin: { championId: championData.id as number } },
      })
      await prisma.skin.deleteMany({
        where: { championId: championData.id as number },
      })

      // recreate skins 
      if (skinsCreate.length) {
        await prisma.champion.update({
          where: { id: championData.id as number },
          data: {
            skins: { create: skinsCreate },
          },
        })
      }

      console.log(`Seeded champion ${championData.name} (${championData.id}) with ${skinsCreate.length} skins`)
    } catch (err: any) {
      // skip ids that don't exist
      console.warn(`Skipping champion ${champId}: ${err?.response?.status ?? ''} ${err?.message}`)
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })