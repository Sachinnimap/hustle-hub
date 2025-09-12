import { BusinessException } from 'src/common/exceptions/bussiness.exception';
import { RegisterDto } from './dto/register.dto';
import { BadRequestException, HttpException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { LoginDto } from './dto/login.dto';
import {JwtService} from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { ResetDto, ResetPasswordDto } from './dto/reset.dto';
import { ResetPassword } from './models/reset.model';
import { Op } from 'sequelize';
import { MailService } from '../mail/mail.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CACHE_MANAGER} from '@nestjs/cache-manager'
import  type { Cache } from 'cache-manager';

export class AuthService {
  constructor(
    private mailService :MailService,
    private jwtService : JwtService,
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(ResetPassword) private resetPasswordModel : typeof ResetPassword,
    @Inject(CACHE_MANAGER) private cacheManager :  Cache
) {}

  async register(registerDto: RegisterDto) {
    const { name, email, mobile, password, confirmPassword } = registerDto;

    if (password !== confirmPassword)
      throw new BusinessException('Password not matched!');

    const user = await this.userModel.findOne({ where: { email } });

    if (user) throw new BusinessException('User already exist');
   const userData =  await this.userModel.create({ name, email, password, mobile });
   const token = await this.createToken({userId:userData.id,roleId:userData.getDataValue('roleId')??3})
                 await userData.update({token},{where :{individualHooks: false}})
              
                 //redis
               await this.cacheManager.del('userDetails')
               await this.cacheManager.set('userDetails',userData,3600 * 1000)
    return {
        name : userData.name,
        token : token
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ where: { email } });
    if (!user) throw new BusinessException('Invalid credentials');

    const hashedPassword = user.getDataValue('password')
    const roleId = user.getDataValue("roleId")
    console.log("roleId",roleId)
    const comparePassword =  await bcrypt.compare(password,hashedPassword)
    if(!comparePassword) throw new BusinessException("Invalid credentials")

    const token = await this.createToken({userId: user.id,roleId})
     await user.update({token},{where :{individualHooks: false}})
         //redis
               await this.cacheManager.del('userDetails')
               await this.cacheManager.set('userDetails',JSON.stringify(user),3600 * 1000)

               const userDetails =  await this.cacheManager.get('userDetails')
               console.log('userDetails',userDetails)
    return {
        name : user.name,
        token : token
    };
  }

  async logout(req:any){
    const {userId}= req.user;
        await this.userModel.update({token:null},{where:{id:userId}})
        await this.cacheManager.del('userDetails')
        return null;
  }
 
  async resetPassword(body : ResetDto){
    const {email} =  body;
    const getUser = await this.userModel.findOne({where : {email}})
    if(!getUser) throw new BusinessException("Email not registered!")
      const otp = Math.floor(100000 + Math.random() * 900000);
      const checkEmail = await this.resetPasswordModel.findOne({where:{email}})
      if(checkEmail) await this.resetPasswordModel.update({otp},{where : {email}})
      else await this.resetPasswordModel.create({email,otp})
  
     this.mailService.appliedJobMail(email,`Reset OTP ${otp}`,`Your OTP is ${otp}`);
    return null
  }


  async varifyResetPassword(body : ResetPasswordDto){
    const { confirmPassword,email,otp,password} = body;
        if (password !== confirmPassword)
      throw new BusinessException('Password not matched!');

   const userData =  await this.resetPasswordModel.findOne({where :{email},raw :true})
   if(!userData) throw new BusinessException("Invalid email address")

    if(userData.otp != otp) throw new BusinessException("Invalid OTP")
     await this.userModel.update({password},{where :{email},individualHooks: true})
     return null;
  }

async getAllCandidates(query :PaginationDto ){
 const { pageNo = 1, limit = 10 } = query;
      
    const candidates =  await  this.userModel.findAll({
      where: { deleted: false ,roleId: 3},
      limit : limit,
      offset : (pageNo - 1)* limit,
      order : [["id","DESC"]],
      attributes : ['name','mobile','email','createdAt','updatedAt']
    });

    const total = await this.userModel.count({
      where: { deleted: false ,roleId: 3}})

      return {
        total ,
        candidates
      }
}

async getAllRecruiters(query : PaginationDto){
   const { pageNo = 1, limit = 10 } = query;
    const recruiters =  await  this.userModel.findAll({
      where: { deleted: false ,roleId: 2},
      limit : limit,
      offset : (pageNo - 1)* limit,
      order : [["id","DESC"]],
      attributes : ['name','mobile','email','createdAt','updatedAt']
    });

    const total = await this.userModel.count({
      where: { deleted: false ,roleId: 2}})

      return {
        total ,
        recruiters
      }
}

  async delete(id:number){
    const result =   await this.userModel.update({deleted: true},{where:{id , role_id: { [Op.ne]: 1 }}})
    
   if (Array.isArray(result) && result[0] === 0) throw new BusinessException(`user not found`);

    return null;
  }


  async createToken(payload:any) {
    const accessToken = await this.jwtService.signAsync(payload);
    return accessToken;
}

}