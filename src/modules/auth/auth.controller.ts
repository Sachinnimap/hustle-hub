import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import {Response} from "../../common/utils/response"
import { LoginDto } from "./dto/login.dto";
import { ResetDto, ResetPasswordDto } from "./dto/reset.dto";

@Controller('auth')
export class AuthController{
    constructor(private readonly authService : AuthService ){}

  @Post('/register')
  async register(@Body() body : RegisterDto){
   return new Response(201,'Registered successfully', await this.authService.register(body))
  }

  @Post('/login')
  async login(@Body() body : LoginDto){
   return new Response(200,'LoggedIn successfully', await this.authService.login(body))
  }

  @Get('/logout/:id')
  async logout(@Param('id') id : number){
   return new Response(200,'LogOut success', await this.authService.logout(+id))
  }

  @Post("/reset")
  async reset(@Body() body:ResetDto){
      return new Response(200, 'reset called success', await this.authService.reset(body))
  }

  @Post('/reset-password')
  async resetPassword(@Body() body: ResetPasswordDto){
    return new Response(201,'password reset success',await this.authService.resetPassword(body))
  }
}