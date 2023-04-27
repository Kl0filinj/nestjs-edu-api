import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateReviewDto } from 'src/review/dto/createReview.dto';
import { Types, disconnect } from 'mongoose';
import { AppModule } from '../src/app.module';

const testProductId = new Types.ObjectId().toString();

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/ (GET)', () => {});

    afterAll(async () => {
        await app.close();
    });
});
