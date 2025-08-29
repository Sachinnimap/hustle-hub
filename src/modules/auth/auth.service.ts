import { BusinessException } from 'src/common/exceptions/bussiness.exception';
import { RegisterDto } from './dto/register.dto';
import { BadRequestException, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { LoginDto } from './dto/login.dto';
import {JwtService} from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

export class AuthService {
  constructor(
    private jwtService : JwtService,
    @InjectModel(User) private userModel: typeof User
) {}

  async register(registerDto: RegisterDto) {
    const { name, email, mobile, password, confirmPassword } = registerDto;

    if (password !== confirmPassword)
      throw new BusinessException('Password not matched!');

    const user = await this.userModel.findOne({ where: { email } });

    if (user) throw new BusinessException('User already exist');
   const userData =  await this.userModel.create({ name, email, password, mobile });

   const token = await this.createToken({userId:userData.id})
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

    const token = await this.createToken({userId: user.id})
    return {
        name : user.name,
        token : token
    };
  }

  async createToken(payload:any) {
    const accessToken = await this.jwtService.signAsync(payload);
    return {
      accessToken,
    };
}

}