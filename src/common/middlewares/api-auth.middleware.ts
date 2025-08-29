import {NestMiddleware} from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { NextFunction, Request, Response } from "express"
import { BusinessException } from "../exceptions/bussiness.exception"

export class ApiAuthMiddleware  implements NestMiddleware{
    constructor( private readonly jwtService: JwtService){

    }
    async use(req: Request, res: Response, next: NextFunction) {
            try{
            const token = req?.headers?.authorization?.split(" ")[1] || null
            
           if(!token) throw new BusinessException("Unauthorized")

              await this.jwtService.verifyAsync(token)

            }catch(error){
                 throw new BusinessException(error.message?error.message:error.toString())
            }

        next()
    }
    
}