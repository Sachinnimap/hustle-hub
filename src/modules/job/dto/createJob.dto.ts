import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional } from "class-validator";


export class CreateJobDto{

    @ApiProperty({
        description : 'job title',
        required : true,
    })
    @Transform(({value})=> value?.trim())
    @IsNotEmpty()
    title : string

    @ApiProperty()
    @Transform(({value})=> value?.trim())
    @IsOptional()
    description : string
}