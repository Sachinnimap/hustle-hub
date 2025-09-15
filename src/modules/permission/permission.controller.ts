import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { CreatePermissionDto } from "./dto/permission.dto";
import { Response } from "src/common/utils/response";
import { PermissionService } from "./permission.service";
import { AuthUserGuard } from "../auth/guards/auth.guard";
import { RoleGuard } from "../auth/guards/role.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags('add url to permisson')
@ApiBearerAuth('JWT-auth')
@Controller('permission')
@UseGuards(AuthUserGuard,RoleGuard)
export class PermissionController{
    constructor(private readonly permissoinService: PermissionService){}

@Post('/')
async create(@Body() body: CreatePermissionDto){
    return new Response(201,'permission created success',await this.permissoinService.createPermission(body))
}


}