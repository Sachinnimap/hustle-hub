import { Body, Controller, Post } from "@nestjs/common";
import { PermissionDto } from "./dto/permission.dto";
import { Response } from "src/common/utils/response";


@Controller('permission')
export class PermissionController{

@Post('/')
async create(@Body() body: PermissionDto){
    
    return new Response(201,'permission created success',await this.)
}

}