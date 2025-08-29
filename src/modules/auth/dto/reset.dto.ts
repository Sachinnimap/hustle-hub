import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, Matches } from "class-validator";

export class ResetDto{
    @Transform(({value}) => value?.trim())
    @IsEmail({},{message : "Please enter valid email address"})
    @IsNotEmpty({message :"email is required"})
    email : string
}

export class ResetPasswordDto{
     
    @Transform(({value}) => value?.trim())
    @IsEmail({},{message : "Please enter valid email address"})
    @IsNotEmpty({message :"email is required"})
    email : string

    @Transform(({value}) => value?.trim())
    @IsNotEmpty({message :"OTP is required"})
    otp : string

   @Transform(({value})=> value.trim())
   @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,{message : "Password must have at least 8 characters , 1 uppercase , 1 number, and 1 special character"})
   @IsNotEmpty({message : "Password is required"})
   password : string
   
   @Transform(({value})=> value.trim())
   @IsNotEmpty({message : "Confirm password is required"})
   confirmPassword : string

}