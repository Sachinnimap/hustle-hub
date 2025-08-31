import { IsOptional } from "class-validator";


export class PaginationDto{

    @IsOptional()
    pageNo? : number

    @IsOptional()
    limit? :number
}