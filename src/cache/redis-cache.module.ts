import KeyvRedis from "@keyv/redis";
import { CacheModule } from "@nestjs/cache-manager";
import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RedisCacheService } from "./redis-cache.service";

@Global()
@Module({
    imports : [
        CacheModule.registerAsync({
            inject : [ConfigService],
            useFactory : async(configService : ConfigService)=>{
                const redisURI  = await configService.get('redis.url')

                  const stores = new KeyvRedis(redisURI)
                  
                    stores.on('error',async(msg)=>{
                        console.log("Error while connecting to Redis",msg)
                    })
                    console.log("Redis connected!")
                return {stores}
            }
        })
    ],
    providers : [RedisCacheService],
    exports : [RedisCacheService]
})
export class RedisCacheModule{}

