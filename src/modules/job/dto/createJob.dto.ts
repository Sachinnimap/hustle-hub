import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional } from "class-validator";


export class CreateJobDto{

    @Transform(({value})=> value?.trim())
    @IsNotEmpty()
    title : string


    @Transform(({value})=> value?.trim())
    @IsOptional()
    description : string
}