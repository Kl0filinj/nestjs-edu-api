import { Test } from '@nestjs/testing';
import { TopPageController } from './top-page.controller';
import { TopPageService } from './top-page.service';
import { TopPageModel } from './top-page.model';
import { getModelToken } from '@nestjs/mongoose';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { TopLevelCategory } from './top-page.model';
import { Model } from 'mongoose';

type MockModel<T = any> = Partial<Record<keyof Model<T>, jest.Mock>> & {
    new (data?: any): T;
};

export const createMockModel = <T = any>(): MockModel<TopPageModel> =>
    ({
        create: jest.fn(),
        findById: jest.fn(),
        findOne: jest.fn(),
        find: jest.fn(),
        findByIdAndDelete: jest.fn(),
        findByIdAndUpdate: jest.fn(),
    } as any);

describe('Top Page', () => {
    let topPageController: TopPageController;
    let topPageService: TopPageService;
    let topPageModel: MockModel;

    const testPageDto: CreateTopPageDto = {
        firstCategory: TopLevelCategory.Books,
        secondCategory: 'Разработка',
        alias: 'javascript',
        title: 'Курсы по JavaScript',
        category: 'javascript',
        hh: {
            count: 1000,
            juniorSalary: 120000,
            middleSalary: 220000,
            seniorSalary: 350000,
        },
        advantages: [
            {
                title: 'Скорость разработки',
                description: 'Mod описание',
            },
        ],
        seoText: 'тест',
        tagsTitle: 'Полученные знания',
        tags: ['TypeScript'],
    };
    const testPageId = '1';

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [TopPageController],
            providers: [
                TopPageService,
                {
                    provide: getModelToken(TopPageModel.name),
                    useValue: createMockModel(),
                },
            ],
        }).compile();

        topPageController = moduleRef.get<TopPageController>(TopPageController);
        topPageService = moduleRef.get<TopPageService>(TopPageService);
        topPageModel = moduleRef.get<MockModel>(
            getModelToken(TopPageModel.name),
        );
    });

    test('Controller should be defined', () => {
        expect(topPageController).toBeDefined();
        expect(topPageService).toBeDefined();
    });

    describe('Top Page Services', () => {
        test('Top Page create Method', async () => {
            topPageModel.create.mockReturnValue(testPageDto);

            const newPage = await topPageService.create(testPageDto);
            expect(newPage).toEqual(testPageDto);
        });

        test('Top Page findById Method', async () => {
            topPageModel.findById.mockReturnValue(testPageDto);

            const pageByid = await topPageService.findById(testPageId);
            expect(pageByid).toEqual(testPageDto);
        });

        test('Top Page findByAlias Method', async () => {
            topPageModel.findOne.mockReturnValue([testPageDto]);
            const testPageAlias = 'Test';

            const pageByAlias = await topPageService.findByAlias(testPageAlias);
            expect(pageByAlias).toEqual([testPageDto]);
        });

        test('Top Page findByCategory Method', async () => {
            topPageModel.find.mockReturnValue([testPageDto]);
            const testPageCategory: TopLevelCategory = TopLevelCategory.Books;

            const pageByCategory = await topPageService.findByCategory(
                testPageCategory,
            );
            expect(pageByCategory).toEqual([testPageDto]);
        });

        test('Top Page findByText Method', async () => {
            topPageModel.find.mockReturnValue([testPageDto]);
            const testPageText = 'Test';

            const pageByText = await topPageService.findByText(testPageText);
            expect(pageByText).toEqual([testPageDto]);
        });

        test('Top Page delete Method', async () => {
            topPageModel.findByIdAndDelete.mockReturnValue(testPageDto);

            const deletedPage = await topPageService.delete(testPageId);
            expect(deletedPage).toEqual(testPageDto);
        });

        test('Top Page update Method', async () => {
            topPageModel.findByIdAndUpdate.mockReturnValue(testPageDto);

            const updatedPage = await topPageService.updateById(
                testPageDto,
                testPageId,
            );
            expect(updatedPage).toEqual(testPageDto);
        });
    });
});
