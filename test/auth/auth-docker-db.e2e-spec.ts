import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AuthModule } from '../../src/auth/auth.module';
import * as request from 'supertest';
import {
    USER_EXISTS,
    USER_NOT_FOUND,
    USER_WRONG_PASSWORD,
} from '../../src/auth/auth.constants';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    const loginDto = {
        login: 'alex123@gmail.com',
        password: '12345',
    };

    const newUserDto = {
        login: 'test01@gmail.com',
        password: '12345',
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot(),
                AuthModule,
                MongooseModule.forRootAsync({
                    imports: [ConfigModule],
                    inject: [ConfigService],
                    useFactory: async (configService: ConfigService) => {
                        const uri = `mongodb://${configService.get(
                            'MONGO_INITDB_ROOT_USERNAME',
                        )}:${configService.get(
                            'MONGO_INITDB_ROOT_PASSWORD',
                        )}@localhost:27017/test-db`;
                        console.log('URI - ', uri);
                    },
                }),
                // ConfigModule.forRoot(),
                // AuthModule,
                // MongooseModule.forRoot(
                //     `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@localhost:27017/test-db`,
                // ),
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    describe('[Feature] Auth - /auth', () => {
        describe('REGISTER USER', () => {
            it('Register [POST /] - Success', async () => {
                const { body } = await request(app.getHttpServer())
                    .post('/auth/register')
                    .send(newUserDto);

                expect(body).toEqual(
                    expect.objectContaining({
                        email: newUserDto.login,
                        createdAt: expect.any(String),
                    }),
                );
            });

            // it('Register [POST /] - Wrong DTO', async () => {
            //     return request(app.getHttpServer())
            //         .post('/auth/register')
            //         .send({ ...loginDto, login: 'Not_an_Email' })
            //         .expect(HttpStatus.BAD_REQUEST);
            // });

            // it('Register [POST /] - User already exist', async () => {
            //     const { body } = await request(app.getHttpServer())
            //         .post('/auth/register')
            //         .send(loginDto)
            //         .expect(HttpStatus.NOT_FOUND);

            //     expect(body.message).toEqual(USER_EXISTS);
            // });
        });

        // describe('LOGIN USER', () => {
        //     it('Login [POST /] - Success', async () => {
        //         const { body } = await request(app.getHttpServer())
        //             .post('/auth/login')
        //             .send(newUserDto);

        //         expect(body).toHaveProperty('access_token');
        //         expect(body).toEqual(
        //             expect.objectContaining({
        //                 access_token: expect.any(String),
        //             }),
        //         );
        //     });

        //     it('Login [POST /] - Wrong DTO', () => {
        //         return request(app.getHttpServer())
        //             .post('/auth/login')
        //             .send({ ...newUserDto, login: 'Not_an_Email' })
        //             .expect(HttpStatus.BAD_REQUEST);
        //     });

        //     it('Login [POST /] - User not found', async () => {
        //         const { body } = await request(app.getHttpServer())
        //             .post('/auth/login')
        //             .send({ ...newUserDto, login: 'vasiliy1@gmail.com' })
        //             .expect(HttpStatus.UNAUTHORIZED);

        //         expect(body.message).toEqual(USER_NOT_FOUND);
        //     });

        //     it('Login [POST /] - Wrong password', async () => {
        //         const { body } = await request(app.getHttpServer())
        //             .post('/auth/login')
        //             .send({
        //                 ...newUserDto,
        //                 password: 'wrongpassword',
        //             })
        //             .expect(HttpStatus.UNAUTHORIZED);

        //         expect(body.message).toEqual(USER_WRONG_PASSWORD);
        //     });
        // });
    });

    afterEach(async () => {
        await app.close();
    });
});
