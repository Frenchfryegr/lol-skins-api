import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import axios from 'axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

import { environment } from 'src/environment';


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
        super();
    }


  async onModuleInit() {
    await this.$connect();
  }


//#region Champions
  async findAllChampions(verbose: boolean = false) {
    if (verbose) {
        return this.champion.findMany()
    }
    return this.champion.findMany({
        select: {
            id: true, 
            name: true, 
            title: true
        },
    })
  }

  async findChampion(id: number) {
      return this.champion.findUnique({
          where: {
              id: id
            }
        })
    }
//#endregion

//#region Skins   
    async findAllSkins(verbose: boolean = false) {
        if (verbose) {
            return this.skin.findMany()
        }
        return this.skin.findMany({
            select: {
                id: true, 
                name: true, 
                tilePath: true
            },
        })
    }

    async findSkin(id: number) {
        return this.skin.findUnique({
            where: {id: id}
        })
    }

    async findAllSkinsForChampion(championId: number, verbose: boolean = false) {

        if (verbose) {
            return this.skin.findMany({
              where: { championId },
              include: {
                chromas: true,
                skinLines: true,
              },
            });
        }
        
        return this.skin.findMany({
            where: { championId },
            select: {
                id: true,
                name: true,
                tilePath: true
            }});
    }

    async findChampBaseSkinArt(champId: number): Promise<{ data: Buffer; contentType: string }> {
        // check cache 
        const cacheKey = environment.cacheKeys.baseImage(champId);

        const cached = await this.cacheManager.get<{ data: Buffer; contentType: string }>(cacheKey);
        if (cached) {
            console.log(`Got cached champ base skin art [champId: ${champId}]`)
            return cached;
        }

        const skin = await this.skin.findFirst({
            where: { 
                championId: champId, 
                isBase: true 
            },
            select: { 
                id: true,
                tilePath: true 
            },
        });

        if (!skin?.tilePath) {
            throw new Error('Skin not found');
        }
        
        // fetch skin using URL path from DB
        try {
            const response = await axios.get(skin.tilePath, { 
                responseType: 'arraybuffer',
                timeout: 10000 
            });
            
            const imageBuffer = Buffer.from(response.data);
            const contentType = response.headers['content-type'] || this.getContentTypeFromPath(skin.tilePath);
            
            const result = { data: imageBuffer, contentType };
            
            // cache image buffer for 24 hours
            await this.cacheManager.set(cacheKey, result, 86400000);
            
            return result;
        } catch (error) {
        throw new Error(`Failed to fetch champ base skin art: ${error.message}`);
        }
    }

    async findSkinTileArt(skinId: number): Promise<{ data: Buffer; contentType: string }> {
        // check cache 
        const cacheKey = environment.cacheKeys.tileArt(skinId);

        const cached = await this.cacheManager.get<{ data: Buffer; contentType: string }>(cacheKey);
        if (cached) {
            console.log(`Got cached skin tile art [skinId: ${skinId}]`)
            return cached;
        }

        // if not cached find the Community Dragon URL from database
        const skin = await this.skin.findUnique({
            where: { id: skinId },
            select: { tilePath: true },
        });

        if (!skin?.tilePath) {
            throw new Error('Skin not found');
        }
        
        // fetch skin using URL path from DB
        try {
            const response = await axios.get(skin.tilePath, { 
                responseType: 'arraybuffer',
                timeout: 10000 
            });
            
            const imageBuffer = Buffer.from(response.data);
            const contentType = response.headers['content-type'] || this.getContentTypeFromPath(skin.tilePath);
            
            const result = { data: imageBuffer, contentType };
            
            // cache image buffer for 24 hours
            await this.cacheManager.set(cacheKey, result, 86400000);
            
            return result;
        } catch (error) {
        throw new Error(`Failed to fetch skin tile art: ${error.message}`);
        }
    }
    //#endregion

    private getContentTypeFromPath(path: string): string {
        if (path.endsWith('.jpg') || path.endsWith('.jpeg')) return 'image/jpeg';
        if (path.endsWith('.png')) return 'image/png';
        if (path.endsWith('.gif')) return 'image/gif';
        if (path.endsWith('.webp')) return 'image/webp';
        return 'application/octet-stream';
    }

}
