import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductModel } from './product.model';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
@Injectable()
export class ProductService {
    constructor(
        @InjectModel(ProductModel.name)
        private readonly productModel: Model<ProductModel>, // @InjectPinoLogger(ProductService.name) // private readonly logger: PinoLogger,
    ) {}

    async create(dto: CreateProductDto): Promise<ProductModel> {
        return await this.productModel.create(dto);
    }

    async findById(id: string): Promise<ProductModel> {
        return await this.productModel.findById(id);
    }

    async deleteById(id: string): Promise<ProductModel> | null {
        return await this.productModel.findByIdAndDelete(id);
    }

    async updateById(
        dto: Partial<CreateProductDto>,
        id: string,
    ): Promise<ProductModel> | null {
        return await this.productModel.findByIdAndUpdate(id, dto, {
            new: true,
        });
    }

    async findWithReviews(dto: FindProductDto) {
        return await this.productModel
            .aggregate()
            .match({ categories: dto.category })
            .sort({ _id: 1 })
            .limit(dto.limit)
            .lookup({
                from: 'reviewmodels',
                localField: '_id',
                foreignField: 'productId',
                as: 'reviews',
            })
            .addFields({
                reviewCount: { $size: '$reviews' },
                reviewAvg: { $avg: '$reviews.rating' },
            });
    }
}
