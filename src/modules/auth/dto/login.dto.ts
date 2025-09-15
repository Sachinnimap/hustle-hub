import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsEmail, IsNotEmpty, Matches } from "class-validator"

export class LoginDto{

    @ApiProperty({
        description : "Please provide valid email address"
    })
    @IsEmail({},{message : "Please provide valid email address"})
    @IsNotEmpty({message : "Email is required"})
    @Transform(({value})=> value.trim())
    email : string

    @ApiProperty({
        description : "Password must have at least 8 characters , 1 uppercase , 1 number, and 1 special character"
    })
    @Transform(({value})=> value.trim())
    @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,{message : "Password must have at least 8 characters , 1 uppercase , 1 number, and 1 special character"})
    @IsNotEmpty({message:"password is required!"})
    password : string
}