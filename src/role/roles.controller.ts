import { Controller, Get, Post, Body, BadRequestException } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from './role.entity';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async getRoles(): Promise<Role[]> {
    return this.rolesService.findAll();
  }

  @Post()
  async createRole(@Body() body: { name: string }): Promise<Role> {
    const { name } = body;

    if (!name) {
      throw new BadRequestException('Tên role là bắt buộc');
    }

    // Kiểm tra trùng tên
    const exists = await this.rolesService.findByName(name);
    if (exists) {
      throw new BadRequestException('Role đã tồn tại');
    }

    return this.rolesService.create(name);
  }
}
