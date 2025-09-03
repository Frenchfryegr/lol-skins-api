import { Controller, HttpCode, HttpStatus, Post, Body, Response } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './public.decorator';

@Controller('auth')
@Public()
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(@Body() login: LoginDto) {
        return this.authService.register(login);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() login: LoginDto) {
        return this.authService.login(login);
    }
}
