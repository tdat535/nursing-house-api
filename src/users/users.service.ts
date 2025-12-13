import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Role } from '../role/role.entity';
import bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,

    @InjectRepository(Role)
    private rolesRepo: Repository<Role>,
  ) { }

  async createUser(email: string, password: string, roleId: number) {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tìm role entity
    const role = await this.rolesRepo.findOne({ where: { id: roleId } });
    if (!role) {
      throw new BadRequestException('Role không tồn tại');
    }

    const user = this.usersRepo.create({
      email,
      password: hashedPassword,
      role, // gắn entity Role
    });

    return this.usersRepo.save(user);
  }

  async findByEmail(email: string) {
    return this.usersRepo.findOne({
      where: { email },
      relations: ['role'],
    });
  }
}
