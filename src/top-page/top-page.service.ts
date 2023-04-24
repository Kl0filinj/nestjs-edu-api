import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TopPageDocument, TopPageModel } from './top-page.model';
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

    async get(id: string): Promise<TopPageDocument> {
        return await this.topPageModel.findById(id);
    }

    async delete(id: string): Promise<TopPageDocument> | null {
        return await this.topPageModel.findByIdAndDelete(id);
    }
}
