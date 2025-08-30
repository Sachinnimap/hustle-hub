import { CanActivate, ExecutionContext, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { BusinessException } from 'src/common/exceptions/bussiness.exception';

@Injectable()
export class AuthUserGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService
  ) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    try {
      console.log("run!")
      const request = context.switchToHttp().getRequest();
      const token = request.headers['authorization']?.split(' ')[1] || null;
      const payload = await this.jwtService.verifyAsync(token);
      request.user = {
        userId: payload.userId,
        roleId: payload.roleId
      }
      return true;
    } catch (error) {
      if (error instanceof JsonWebTokenError)
        throw new UnauthorizedException(`Unauthorized`);
      throw new BusinessException(error.message?error.message:error.toString());
    }
  }
}
