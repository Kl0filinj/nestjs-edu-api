import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TopPageModule } from '../../src/top-page/top-page.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import mongoose, { disconnect } from 'mongoose';
import * as request from 'supertest';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../../src/auth/strategies/jwt.strategy';
import { AuthModule } from '../../src/auth/auth.module';
import {
    testAlias,
    testPageDto,
    testPageFindDto,
    testResponsePageDto,
    testUnknownPageResponse,
} from './__mocks__/requestData.top-page';

describe('[Feature] Top Page - /top-page', () => {
    let app: INestApplication;
    let token: string;
    let newPageId: mongoose.Types.ObjectId;

    const testPageSearchText = 'Books';

    const loginDto = {
        login: 'alex123@gmail.com',
        password: '12345',
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot(),
                TopPageModule,
                MongooseModule.forRootAsync({
                    imports: [ConfigModule],
                    inject: [ConfigService],
                    useFactory: async (configService: ConfigService) => ({
                        uri: configService.get('DB_HOST'),
                        useNewUrlParser: true,
                        useUnifiedTopology: true,
                    }),
                }),
                AuthModule,
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        const { body } = await request(app.getHttpServer())
            .post('/auth/login')
            .send(loginDto);
        token = body.access_token;
    });

    describe('CREATE TOP PAGE', () => {
        it('Create [POST /] - Unauthorized', async () => {
            return await request(app.getHttpServer())
                .post('/top-page/create')
                .send(testPageDto)
                .expect(HttpStatus.UNAUTHORIZED);
        });

        it('Create [POST /] - Success', async () => {
            const { body } = await request(app.getHttpServer())
                .post('/top-page/create')
                .set('Authorization', 'Bearer ' + token)
                .send(testPageDto)
                .expect(HttpStatus.CREATED);

            newPageId = body._id;
            expect(body).toBeDefined();
        });

        it('Create [POST /] - Wrong DTO', () => {
            return request(app.getHttpServer())
                .post('/top-page/create')
                .set('Authorization', 'Bearer ' + token)
                .send({ ...testPageDto, firstCategory: 'sada' })
                .expect(HttpStatus.BAD_REQUEST);
        });
    });

    describe('GET TOP PAGE BY ID/ALIAS/TEXT/CATEGORY', () => {
        describe('ID', () => {
            it('GetById [GET /] - Success', async () => {
                const { body } = await request(app.getHttpServer())
                    .get(`/top-page/${newPageId}`)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(HttpStatus.OK);

                expect(body).toEqual(testResponsePageDto);
            });

            it('GetById [GET /] - Not Found ID', () => {
                return request(app.getHttpServer())
                    .get(`/top-page/${'644a5257f3cb14551ff1123b'}`)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(HttpStatus.NOT_FOUND);
            });

            it('GetById [GET /] - Wrong ID', () => {
                return request(app.getHttpServer())
                    .get(`/top-page/${'644a5257f3cb14551ff1123basdsa'}`)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(HttpStatus.BAD_REQUEST);
            });
        });

        describe('ALIAS', () => {
            it('GetByAlias [GET /] - Success', async () => {
                const { body } = await request(app.getHttpServer())
                    .get(`/top-page/byAlias/${testAlias}`)
                    .expect(HttpStatus.OK);

                expect(body).toEqual(testResponsePageDto);
            });

            it('GetByAlias [GET /] - Not Found Alias', () => {
                return request(app.getHttpServer())
                    .get(`/top-page/byAlias/${'wrongAlias'}`)
                    .expect(HttpStatus.NOT_FOUND);
            });
        });

        describe('CATEGORY', () => {
            it('GetByCategory [POST /] - Success', async () => {
                const expected = {
                    alias: expect.any(String),
                    category: expect.any(String),
                    secondCategory: expect.any(String),
                    title: expect.any(String),
                    _id: expect.any(String),
                };

                const { body } = await request(app.getHttpServer())
                    .post(`/top-page/find`)
                    .send(testPageFindDto)
                    .expect(HttpStatus.OK);

                expect(body).toEqual(expect.arrayContaining([expected]));
            });

            it('GetByCategory [POST /] - Wrong DTO', async () => {
                const { body } = await request(app.getHttpServer())
                    .post(`/top-page/find`)
                    .send({
                        ...testPageFindDto,
                        firstCategory: 'Wrong Category',
                    })
                    .expect(HttpStatus.OK);

                expect(body).toEqual([]);
            });
        });

        describe('TEXT', () => {
            it('GetByText [GET /] - Success', async () => {
                const { body } = await request(app.getHttpServer())
                    .get(`/top-page/textSearch/${testPageSearchText}`)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(HttpStatus.OK);

                expect(body).toEqual(
                    expect.arrayContaining([testUnknownPageResponse]),
                );
            });

            it('GetByText [GET /] - Without Text', () => {
                return request(app.getHttpServer())
                    .get(`/top-page/textSearch/`)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(HttpStatus.BAD_REQUEST);
            });

            it('GetByText [GET /] - Wrong DTO', async () => {
                const { body } = await request(app.getHttpServer())
                    .get(`/top-page/textSearch/${'Wrong text'}`)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(HttpStatus.OK);

                expect(body).toEqual([]);
            });
        });
    });

    describe('UPDATE TOP PAGE', () => {
        it('Update [PATCH /] - Success', async () => {
            const { body } = await request(app.getHttpServer())
                .patch(`/top-page/${newPageId}`)
                .set('Authorization', 'Bearer ' + token)
                .send(testPageDto)
                .expect(HttpStatus.OK);

            expect(body).toEqual(testResponsePageDto);
        });

        it('Update [PATCH /] - Wrong DTO', () => {
            return request(app.getHttpServer())
                .patch(`/top-page/${newPageId}`)
                .set('Authorization', 'Bearer ' + token)
                .send({ ...testPageDto, firstCategory: 'Wrong Category' })
                .expect(HttpStatus.BAD_REQUEST);
        });

        it('Update [PATCH /] - Wrong ID', () => {
            return request(app.getHttpServer())
                .patch(`/top-page/${'644a5257f3cb14551ff1123basdsa'}`)
                .set('Authorization', 'Bearer ' + token)
                .send(testPageDto)
                .expect(HttpStatus.BAD_REQUEST);
        });
    });

    describe('UPDATE TOP PAGE', () => {
        it('Delete [DELETE /] - Success', async () => {
            const { body } = await request(app.getHttpServer())
                .delete(`/top-page/${newPageId}`)
                .set('Authorization', 'Bearer ' + token)
                .send(testPageDto)
                .expect(HttpStatus.OK);

            expect(body).toEqual(testResponsePageDto);
        });

        it('Delete [DELETE /] - Wrong ID', () => {
            return request(app.getHttpServer())
                .delete(`/top-page/${'644a5257f3cb14551ff1123basdsa'}`)
                .set('Authorization', 'Bearer ' + token)
                .send(testPageDto)
                .expect(HttpStatus.BAD_REQUEST);
        });
    });

    afterEach(async () => {
        await disconnect();
    });

    afterAll(async () => {
        await app.close();
    });
});
