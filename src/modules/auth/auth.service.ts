import { BusinessException } from 'src/common/exceptions/bussiness.exception';
import { RegisterDto } from './dto/register.dto';
import { BadRequestException, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { LoginDto } from './dto/login.dto';
import {JwtService} from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { ResetDto, ResetPasswordDto } from './dto/reset.dto';
import { ResetPassword } from './models/reset.model';

export class AuthService {
  constructor(
    private jwtService : JwtService,
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(ResetPassword) private resetPasswordModel : typeof ResetPassword
) {}

  async register(registerDto: RegisterDto) {
    const { name, email, mobile, password, confirmPassword } = registerDto;

    if (password !== confirmPassword)
      throw new BusinessException('Password not matched!');

    const user = await this.userModel.findOne({ where: { email } });

    if (user) throw new BusinessException('User already exist');
   const userData =  await this.userModel.create({ name, email, password, mobile });

   const token = await this.createToken({userId:userData.id,roleId:userData.roleId})
                 await userData.update({token})
    return {
        name : userData.name,
        token : token
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ where: { email } });
    if (!user) throw new BusinessException('Invalid credentials');

    console.log("compa",password)
    console.log("pass",user)
    const comparePassword =  await bcrypt.compare(password,user.password)
    if(!comparePassword) throw new BusinessException("Invalid credentials")

    const token = await this.createToken({userId: user.id,roleId:user.roleId})
    return {
        name : user.name,
        token : token
    };
  }

  async logout(id:number){
        await this.userModel.update({token:null},{where:{id}})
        return null;
  }
 
  async reset(body : ResetDto){
    const {email} =  body;
    const getUser = this.userModel.findOne({where : {email}})
    if(!getUser) throw new BusinessException("Email not registered!")
      const otp = Math.floor(100000 + Math.random() * 900000);
    console.log("OTP",otp)
    //CREATE OTP
    await this.resetPasswordModel.create({email,otp})
    //TODO Sent OTP
    return null
  }


  async resetPassword(body : ResetPasswordDto){
    const { confirmPassword,email,otp,password} = body;
        if (password !== confirmPassword)
      throw new BusinessException('Password not matched!');

   const userData =  await this.resetPasswordModel.findOne({where :{email}})
   if(!userData) throw new BusinessException("Invalid Data")

    if(userData.otp != otp) throw new BusinessException("Invalid OTP")

     await this.userModel.update({password},{where :{email}})

     return null;

  }


  async createToken(payload:any) {
    const accessToken = await this.jwtService.signAsync(payload);
    return {
      accessToken,
    };
}

}