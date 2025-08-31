import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./models/user.model";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { ResetPassword } from "./models/reset.model";
import { RoleGuard } from "./guards/role.guard";
import { MailModule } from "../mail/mail.module";


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
    }), SequelizeModule.forFeature([User,ResetPassword]),MailModule ],
    controllers  : [AuthController,],
    providers : [AuthService],
     exports:[SequelizeModule.forFeature([User,]),AuthService]
})
export class AuthModule{}