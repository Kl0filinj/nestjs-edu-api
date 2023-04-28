import { CreateTopPageDto } from '../../../src/top-page/dto/create-top-page.dto';
import { FindTopPageDto } from '../../../src/top-page/dto/find-top-page.dto';
import { TopLevelCategory } from '../../../src/top-page/top-page.model';

export const testPageFindDto: FindTopPageDto = {
    firstCategory: TopLevelCategory.Books,
};

export const testAlias = 'Java';

export const testPageDto: CreateTopPageDto = {
    firstCategory: TopLevelCategory.Books,
    secondCategory: 'Разработка',
    alias: testAlias,
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

export const testUnknownPageResponse = {
    firstCategory: expect.any(String),
    secondCategory: expect.any(String),
    alias: expect.any(String),
    title: expect.any(String),
    category: expect.any(String),
    hh: expect.objectContaining({
        count: expect.any(Number),
        juniorSalary: expect.any(Number),
        middleSalary: expect.any(Number),
        seniorSalary: expect.any(Number),
    }),
    advantages: expect.arrayContaining([
        expect.objectContaining({
            title: expect.any(String),
            description: expect.any(String),
        }),
    ]),
    seoText: expect.any(String),
    tagsTitle: expect.any(String),
    tags: expect.arrayContaining([expect.any(String)]),
    _id: expect.any(String),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
    __v: expect.any(Number),
};

export const testResponsePageDto = {
    ...testPageDto,
    _id: expect.any(String),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
    __v: expect.any(Number),
};
