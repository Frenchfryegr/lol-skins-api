import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService, private jwtService: JwtService) { }

  async register(login: LoginDto) {
    // see if user exists
    console.log(`Attempting to register user ${login.username} | ${login.email}`);
    const existingUser = await this.prismaService.user.findFirst({
      where: {
        OR: [
          { email: login.email },
          { username: login.username }
        ]
      }
    });

    if (existingUser) {
      throw new ConflictException('User with this email or username already exists');
    }

    // if user does not exist, create the user 
    const hashedPassword = await bcrypt.hash(login.password, 12);
    const user = await this.prismaService.user.create({
      data: {
        email: login.email,
        password: hashedPassword,
        username: login.username
      },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true
      }
    });

    console.log(`Successfully registered user ${login.username} | ${login.email}`);

    return {
      user,
      token: this.generateJWT(user)
    };
  }

   async login(login: LoginDto) {
    console.log(`Login attempt for email: ${login.email}`);
    const user = await this.prismaService.user.findUnique({
      where: { email: login.email },
      select: {
        id: true,
        email: true,
        password: true,
        username: true
      }
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    //test password
    const isPasswordValid = await bcrypt.compare(login.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // remove password from the response
    const { password: _, ...userWithoutPassword } = user;
    
    console.log(`Successfully logged in user ${login.username} | ${login.email}`);
    return {
      user: userWithoutPassword,
      token: this.generateJWT(user)
    };
  }

  private generateJWT(user: any): string {
    const payload = { 
      sub: user.id, 
      email: user.email, 
      username: user.username 
    };
    
    return this.jwtService.sign(payload);
  }

  async validateUser(payload: any) {
    return this.prismaService.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true
      }
    });
  }
}
