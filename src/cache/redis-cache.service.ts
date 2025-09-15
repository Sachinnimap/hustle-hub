import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import type { Cache } from "cache-manager";


@Injectable()
export class RedisCacheService{

    constructor(@Inject(CACHE_MANAGER) private redisClient : Cache){}

    
    async get(name:string){
       return await this.redisClient.get(name)
    }

    async set(name:string,value:any,expiry:number){
        return await this.redisClient.set(name,value,expiry)
    }

    async del(name:string){
        return await this.redisClient.del(name)
    }

}