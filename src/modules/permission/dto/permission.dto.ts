import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreatePermissionDto{
//actionName,baseUrl,method,path,description

    @Transform(({value})=> value?.trim())
    @IsNotEmpty({message : "Action name is required"})
    actionName : string
    

    @Transform(({value})=> value?.trim())
    @IsNotEmpty({message : "Base url required"})
    baseUrl : string
    
    @Transform(({value})=> value?.trim())
    @IsNotEmpty({message : "method is required"})
    method : string
    
    @Transform(({value})=> value?.trim())
    @IsNotEmpty({message : "path is required"})
    path : string

    @IsOptional()
    description : string
}