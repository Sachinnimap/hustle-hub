import { CanActivate, ExecutionContext, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { RedisCacheService } from 'src/cache/redis-cache.service';
import { BusinessException } from 'src/common/exceptions/bussiness.exception';
import { Sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';

@Injectable()
export class AuthUserGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService,
    private readonly  cacheService: RedisCacheService,
        private readonly sequelize: Sequelize,
  ) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.headers['authorization']?.split(' ')[1] || null;
      const getTokenCache =  await this.cacheService.get(token);
      if(getTokenCache){
        const {userId,roleId} = await this.jwtService.verifyAsync(token);
      request.user = {
        userId: userId,
        roleId: roleId
      }
      return true
      }

      const {userId,roleId} = await this.jwtService.verifyAsync(token);

        const getUser = `select * FROM "user" where id =${userId} and token='${token}'`
      
            const isValidUser = await this.sequelize.query(getUser, {
              type: QueryTypes.SELECT,
            });

        if(isValidUser.length == 0){
           throw new UnauthorizedException(`Invalid Token`);
        }
      request.user = {
        userId: userId,
        roleId: roleId
      }

      return true;
    } catch (error) {
      if (error instanceof JsonWebTokenError)
        throw new UnauthorizedException(`Unauthorized`);
      throw new BusinessException(error.message?error.message:error.toString());
    }
  }
}
