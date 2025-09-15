import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { RoleGuard } from "./guards/role.guard";
import { MailModule } from "../mail/mail.module";
import { RedisCacheModule } from "src/cache/redis-cache.module";
import { AuthUserGuard } from "./guards/auth.guard";


@Module({
    imports : [
    JwtModule.registerAsync({
     global: true,
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('jwt.secretKey'),
          signOptions: {
            expiresIn: configService.get('jwt.expirationTime')
          }
        }
      },
      inject: [ConfigService]
    }),MailModule ],
    controllers  : [AuthController,],
    providers : [AuthService],
     exports:[AuthService]
})
export class AuthModule{}