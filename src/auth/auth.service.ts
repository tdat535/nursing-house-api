import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwt: JwtService,
  ) {}

  async register(email: string, password: string, role: number) {
    return this.usersService.createUser(email, password, role);
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Wrong password');

    const token = this.jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role.name,
    });

    return { access_token: token };
  }
}
