import { Injectable } from '@nestjs/common';
import { ReviewDocument, ReviewModel } from './review.model';
import { Model } from 'mongoose';
import { CreateReviewDto } from './dto/createReview.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ReviewService {
    constructor(
        @InjectModel(ReviewModel.name)
        private readonly reviewModel: Model<ReviewModel>,
    ) {}

    async create(dto: CreateReviewDto): Promise<ReviewDocument> {
        return this.reviewModel.create(dto);
    }

    async delete(id: string): Promise<ReviewDocument> | null {
        return this.reviewModel.findByIdAndDelete(id).exec();
    }

    async findByProductId(productId: string): Promise<ReviewDocument[]> {
        return this.reviewModel
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
