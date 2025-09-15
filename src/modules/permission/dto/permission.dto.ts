import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreatePermissionDto{
//actionName,baseUrl,method,path,description
    @ApiProperty()
    @Transform(({value})=> value?.trim())
    @IsNotEmpty({message : "Action name is required"})
    actionName : string
    
    @ApiProperty()
    @Transform(({value})=> value?.trim())
    @IsNotEmpty({message : "Base url required"})
    baseUrl : string
    
    @ApiProperty()
    @Transform(({value})=> value?.trim())
    @IsNotEmpty({message : "method is required"})
    method : string
    
    @ApiProperty()
    @Transform(({value})=> value?.trim())
    @IsNotEmpty({message : "path is required"})
    path : string

    @ApiProperty()
    @IsOptional()
    description : string
}