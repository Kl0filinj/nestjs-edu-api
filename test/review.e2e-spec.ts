import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateReviewDto } from 'src/review/dto/createReview.dto';
import { Types, disconnect } from 'mongoose';
import { AppModule } from '../src/app.module';

const testProductId = new Types.ObjectId().toString();

const testDto: CreateReviewDto = {
    name: 'TEST',
    title: 'Test Title 1',
    description: 'Test description 1',
    rating: 5,
    productId: testProductId,
};

describe('AppController (e2e)', () => {
    let app: INestApplication;
    let createdId: string;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/review/create (POST)', async done => {
        const response = await request(app.getHttpServer())
            .post('/review/create')
            .send(testDto);

        expect(response.status).toBe(201);

        const { _id } = response.body;
        createdId = _id;
        expect(createdId).toBeDefined();
        done(createdId);
    });

    afterAll(async () => {
        disconnect();
    });
});
