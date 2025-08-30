import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, IsNumber } from "class-validator";


export class CreateJobApplyDto{

    // @IsNumber()
    // @IsNotEmpty({message: "Job id required!"})
    // jobId : number;

    // // @IsNumber()
    // // @IsNotEmpty({message : "User id required!"})
    // // userId : number

  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
  @IsInt({ each: true,message :"please provide valid job data" })
  jobIds: number[];
}