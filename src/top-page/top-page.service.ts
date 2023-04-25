import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
    TopLevelCategory,
    TopPageDocument,
    TopPageModel,
} from './top-page.model';
import { Model } from 'mongoose';
import { CreateTopPageDto } from './dto/create-top-page.dto';

@Injectable()
export class TopPageService {
    constructor(
        @InjectModel(TopPageModel.name)
        private readonly topPageModel: Model<TopPageModel>,
    ) {}

    async create(dto: CreateTopPageDto): Promise<TopPageDocument> {
        return await this.topPageModel.create(dto);
    }

    async findById(id: string): Promise<TopPageDocument> {
        return await this.topPageModel.findById(id);
    }

    async findByAlias(alias: string): Promise<TopPageDocument> {
        return await this.topPageModel.findOne({ alias });
    }

    async findByCategory(
        category: TopLevelCategory,
    ): Promise<TopPageDocument[]> {
        return await this.topPageModel.find(
            { category },
            { alias: 1, secondCategory: 1, title: 1 },
        );
    }

    async findByText(text: string): Promise<TopPageDocument[]> {
        return await this.topPageModel.find({
            $text: {
                $search: text,
                $caseSensitive: false,
            },
        });
    }

    async delete(id: string): Promise<TopPageDocument> | null {
        return await this.topPageModel.findByIdAndDelete(id);
    }

    async updateById(
        dto: Partial<CreateTopPageDto>,
        id: string,
    ): Promise<TopPageDocument> {
        return await this.topPageModel.findByIdAndUpdate(id, dto, {
            new: true,
        });
    }
}
