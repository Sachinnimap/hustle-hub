import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import {Response} from "../../common/utils/response"

@Controller('auth')
export class AuthController{
    constructor(private readonly authService : AuthService ){}

  @Post('/register')
  async register(@Body() body : RegisterDto){
   return new Response(201,'Registered successfully', await this.authService.register(body))
  }
}