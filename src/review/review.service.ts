import { Injectable } from '@nestjs/common';
import { ReviewDocument, ReviewModel } from './review.model';
import mongoose, { Model } from 'mongoose';
import { CreateReviewDto } from './dto/createReview.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ReviewService {
    constructor(
        @InjectModel(ReviewModel.name)
        private readonly reviewModel: Model<ReviewModel>,
    ) {}

    async create(dto: CreateReviewDto): Promise<ReviewDocument> {
        const newReview = {
            ...dto,
            productId: new mongoose.Types.ObjectId(dto.productId),
        };
        return await this.reviewModel.create(newReview);
    }

    async delete(id: string): Promise<ReviewDocument> | null {
        return await this.reviewModel.findByIdAndDelete(id).exec();
    }

    async findByProductId(productId: string): Promise<ReviewDocument[]> {
        return await this.reviewModel
            .find({
                productId,
                // МОЖЕТ БЫТЬ ОШИБКА ПОТОМУ ЧТО ОРИГИНАЛЬНАЯ СТРОКА ВЫГЛЯДИТ ТАК: productId: Types.ObjectId(productId)
            })
            .exec();
    }

    // async deleteByProductId(id: string): Promise<ReviewDocument> | null {
    //     return this.reviewModel.deleteMany({ _id: id }).exec();
    // }
}
