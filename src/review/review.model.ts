import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ReviewModel {
    @Prop()
    name: string;

    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop()
    rating: number;

    @Prop()
    productId: mongoose.Types.ObjectId;
}

export type ReviewDocument = ReviewModel & Document;

export const ReviewSchema = SchemaFactory.createForClass(ReviewModel);
