import { Body, Controller, Post } from "@nestjs/common";
import { CreatePermissionDto } from "./dto/permission.dto";
import { Response } from "src/common/utils/response";
import { PermissionService } from "./permission.service";


@Controller('permission')
export class PermissionController{
    constructor(private readonly permissoinService: PermissionService){}

@Post('/')
async create(@Body() body: CreatePermissionDto){
    return new Response(201,'permission created success',await this.permissoinService.createPermission(body))
}


}