import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./models/user.model";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { ResetPassword } from "./models/reset.model";
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
    }), SequelizeModule.forFeature([User,ResetPassword]),MailModule,RedisCacheModule],
    controllers  : [AuthController,],
    providers : [AuthService],
     exports:[SequelizeModule.forFeature([User,]),AuthService]
})
export class AuthModule{}