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
import { Op, Sequelize,QueryTypes } from 'sequelize';
import { MailService } from '../mail/mail.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';


export class AuthService {
  constructor(
    private readonly sequelize: Sequelize,
    private mailService :MailService,
    private jwtService : JwtService,
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(ResetPassword) private resetPasswordModel : typeof ResetPassword
) {}

  async register(registerDto: RegisterDto) {
    const { name, email, mobile, password, confirmPassword } = registerDto;

    if (password !== confirmPassword)
      throw new BusinessException('Password not matched!');

    const [user] =  await this.sequelize.query(
    `SELECT id FROM users WHERE email = :email LIMIT 1`,
    {
      replacements: { email },
      type: QueryTypes.SELECT,
    },
  );

  if (user) throw new BusinessException('User already exist');
   const [userData] = await this.sequelize.query(
    `INSERT INTO users (name, email, password, mobile, role_id)
     VALUES (:name, :email, :password, :mobile, 3)
     RETURNING id, name, role_id`,
    {
      replacements: { name, email, password, mobile },
      type: QueryTypes.INSERT,
    },
  );

   const token = await this.createToken({userId:userData['id'],roleId:userData['roleId']??3})
                 
   await this.sequelize.query(
    `UPDATE users SET token = :token WHERE id = :id`,
    {
      replacements: { token, id: userData['id'] },
      type: QueryTypes.UPDATE,
    },
  );
    return {
        name : userData['name'],
        token : token
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

      const [user] = await this.sequelize.query(
    `SELECT id, name, email, password, role_id 
     FROM users 
     WHERE email = :email 
     LIMIT 1`,
    {
      replacements: { email },
      type: QueryTypes.SELECT,
    },
  );
    if (!user) throw new BusinessException('Invalid credentials');

    const hashedPassword = user['password']
    const roleId = user['roleId']
    const comparePassword =  await bcrypt.compare(password,hashedPassword)
    if(!comparePassword) throw new BusinessException("Invalid credentials")

    const token = await this.createToken({userId: user['id'],roleId})
     await this.sequelize.query(
    `UPDATE users SET token = :token WHERE id = :id`,
    {
      replacements: { token, id: user['id'] },
      type: QueryTypes.UPDATE,
    },
  );
    return {
        name : user['name'],
        token : token
    };
  }

  async logout(req:any){
    const {userId}= req.user;
       await this.sequelize.query(
    `UPDATE users 
     SET token = NULL 
     WHERE id = :id`,
    {
      replacements: { id: userId },
      type: QueryTypes.UPDATE,
    },
  );
        return null;
  }
 
  async resetPassword(body : ResetDto){
    const {email} =  body;
     const [getUser] = await this.sequelize.query(
    `SELECT id FROM user WHERE email = :email LIMIT 1`,
    {
      replacements: { email },
      type: QueryTypes.SELECT,
    },
  );
    if(!getUser) throw new BusinessException("Email not registered!")
      const otp = Math.floor(100000 + Math.random() * 900000);

      const [checkEmail] = await this.sequelize.query(
    `SELECT id FROM reset_password WHERE email = :email LIMIT 1`,
    {
      replacements: { email },
      type: QueryTypes.SELECT,
    },
  );
      if(checkEmail){ await this.sequelize.query(
      `UPDATE reset_password SET otp = :otp WHERE email = :email`,
      {
        replacements: { otp, email },
        type: QueryTypes.UPDATE,
      },
    );
  }
      else{
        await this.sequelize.query(
      `INSERT INTO reset_password (email, otp) VALUES (:email, :otp)`,
      {
        replacements: { email, otp },
        type: QueryTypes.INSERT,
      },
    );
      }
  
     this.mailService.appliedJobMail(email,`Reset OTP ${otp}`,`Your OTP is ${otp}`);
    return null
  }


  async varifyResetPassword(body : ResetPasswordDto){
    const { confirmPassword,email,otp,password} = body;
        if (password !== confirmPassword)
      throw new BusinessException('Password not matched!');

     const [userData] = await this.sequelize.query(
    `SELECT otp FROM reset_passwords WHERE email = :email LIMIT 1`,
    {
      replacements: { email },
      type: QueryTypes.SELECT,
    },
  );
   if(!userData) throw new BusinessException("Invalid email address")

    if(userData["otp"] != otp) throw new BusinessException("Invalid OTP")
     await this.sequelize.query(
    `UPDATE users SET password = :password WHERE email = :email`,
    {
      replacements: { password, email },
      type:QueryTypes.UPDATE,
    },
  );
     return null;
  }

async getAllCandidates(query :PaginationDto ){
 const { pageNo = 1, limit = 10 } = query;
 const offset = (pageNo - 1) * limit;


    const candidates = await this.sequelize.query(
    `
      SELECT name, mobile, email, "createdAt", "updatedAt"
      FROM users
      WHERE deleted = false AND "roleId" = 3
      ORDER BY id DESC
      LIMIT :limit OFFSET :offset
    `,
    {
      replacements: { limit, offset },
      type: QueryTypes.SELECT,
    },
  );

    const [result] = await this.sequelize.query(
    `
      SELECT COUNT(*)::int AS total
      FROM users
      WHERE deleted = false AND "roleId" = 3
    `,
    {
      type: QueryTypes.SELECT,
    },
  );

      return {
        total:result["total"] ,
        candidates
      }
}

async getAllRecruiters(query: PaginationDto) {
  const { pageNo = 1, limit = 10 } = query;
  const offset = (pageNo - 1) * limit;

  // 1. Fetch paginated recruiters
  const recruiters = await this.sequelize.query(
    `
      SELECT name, mobile, email, "createdAt", "updatedAt"
      FROM users
      WHERE deleted = false AND "roleId" = 2
      ORDER BY id DESC
      LIMIT :limit OFFSET :offset
    `,
    {
      replacements: { limit, offset },
      type: QueryTypes.SELECT,
    },
  );

  // 2. Get total count
  const [result] = await this.sequelize.query(
    `
      SELECT COUNT(*)::int AS total
      FROM users
      WHERE deleted = false AND "roleId" = 2
    `,
    {
      type: QueryTypes.SELECT,
    },
  );

  return {
    total: result["total"],
    recruiters,
  };
}


async delete(id: number) {
  await this.sequelize.query(
    `
      UPDATE users
      SET deleted = true
      WHERE id = :id AND "roleId" != 1
      RETURNING id
    `,
    {
      replacements: { id },
      type: QueryTypes.UPDATE,
    },
  )


  return null;
}



  async createToken(payload:any) {
    const accessToken = await this.jwtService.signAsync(payload);
    return accessToken;
}

}