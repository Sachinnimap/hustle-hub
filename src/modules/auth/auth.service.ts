import { BusinessException } from "src/common/exceptions/bussiness.exception";
import { RegisterDto } from "./dto/register.dto";
import { HttpException } from "@nestjs/common";


export class AuthService{

   async  register(registerDto : RegisterDto ){

    const {name,email,password,confirmPassword} = registerDto;

    if(password !== confirmPassword){
        throw new HttpException("Password not matched!",403)
    }

   }

}