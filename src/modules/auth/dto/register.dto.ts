import { Transform } from "@nestjs/class-transformer";
import { Equals, IsEmail, IsNotEmpty, IsString, validate, ValidateIf,Matches, IsMobilePhone } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto{
@ApiProperty()   
@Transform(({value})=> value.trim())
@IsNotEmpty({message : "Name is required"})
@IsString({message : "Name must be string"})
name : string

@ApiProperty()   
@IsEmail({},{message : "Please provide a valid email address"})
@IsNotEmpty({message : "Email address is required"})
@Transform(({value})=> value.trim())
email : string;

@ApiProperty()   
@Matches(/^[6-9]\d{9}$/,{message : "Please enter valid mobile number"})
@IsNotEmpty({message : "Mobile number is required"})
mobile : string;

@ApiProperty()   
@Transform(({value})=> value.trim())
@Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,{message : "Password must have at least 8 characters , 1 uppercase , 1 number, and 1 special character"})
@IsNotEmpty({message : "Password is required"})
password : string

@ApiProperty({title:"re-enter password",description :'please enter confirm password same as password'})   
@Transform(({value})=> value.trim())
@IsNotEmpty({message : "Confirm password is required"})
confirmPassword : string

}