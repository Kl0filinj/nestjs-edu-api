import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel } from './user.model';
import { Model } from 'mongoose';
import { AuthDto } from './dto/auth.dto';
import { genSalt, hash, compare } from 'bcryptjs';
import { USER_NOT_FOUND, USER_WRONG_PASSWORD } from './auth.constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(UserModel.name)
        private readonly userModel: Model<UserModel>,
        private readonly jwtService: JwtService,
    ) {}

    async createUser(
        dto: AuthDto,
    ): Promise<Pick<UserModel, 'email'> & { createdAt: string }> {
        const salt = await genSalt(10);
        const newUser = new this.userModel({
            email: dto.login,
            passwordHash: await hash(dto.password, salt),
        });
        await newUser.save();
        const { email } = newUser;
        const createdAt = new Date(Date.now()).toISOString();
        return { email, createdAt };
    }

    async login(email: string) {
        const payload = { email };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async findUser(email: string): Promise<UserModel> {
        return await this.userModel.findOne({ email });
    }

    async validateUser(
        email: string,
        password: string,
    ): Promise<Pick<UserModel, 'email'>> {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new HttpException(USER_NOT_FOUND, HttpStatus.UNAUTHORIZED);
        }
        if (!(await compare(password, user.passwordHash))) {
            throw new HttpException(
                USER_WRONG_PASSWORD,
                HttpStatus.UNAUTHORIZED,
            );
        }

        return { email: user.email };
    }
}
