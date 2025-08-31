import { Body, Controller, Delete, Get, Param, Post, Query, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import {Response} from "../../common/utils/response"
import { LoginDto } from "./dto/login.dto";
import { ResetDto, ResetPasswordDto } from "./dto/reset.dto";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { AuthUserGuard } from "./guards/auth.guard";
import { RoleGuard } from "./guards/role.guard";

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

  @UseGuards(AuthUserGuard)
  @Get('/logout')
  async logout(@Request() req){
   return new Response(200,'LogOut success', await this.authService.logout(req))
  }

  @Post("/reset-password")
  async resetPassword(@Body() body:ResetDto){
      return new Response(200, 'Otp sent success', await this.authService.resetPassword(body))
  }

  @Post('/varify-reset')
  async varifyResetPassword(@Body() body: ResetPasswordDto){
    return new Response(201,'password reset success',await this.authService.varifyResetPassword(body))
  }

  @UseGuards(AuthUserGuard,RoleGuard)
   @Delete(':id')
  async delete(@Param('id') id: number){
    return new Response(201,'Deleted successfully',await this.authService.delete(+id))
  }

  @UseGuards(AuthUserGuard,RoleGuard)
   @Get('/candidates')
  async getAllCandidates( @Query() query :PaginationDto){
    return new Response(200,'fetched candidates successfully',await this.authService.getAllCandidates(query))
  }

    @UseGuards(AuthUserGuard,RoleGuard)
    @Get('/recruiters')
  async getAllRecruiters( @Query() query :PaginationDto){
    return new Response(200,'fetched recruiters successfully',await this.authService.getAllRecruiters(query))
  }
}
