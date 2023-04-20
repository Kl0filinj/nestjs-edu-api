import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

class Productcharacteristic {
    @Prop()
    name: string;

    @Prop()
    value: string;
}

@Schema({ timestamps: true })
export class ProductModel {
    @Prop()
    image: string;

    @Prop()
    title: string;

    @Prop()
    price: number;

    @Prop()
    oldPrice: number;

    @Prop()
    credit: number;

    @Prop()
    calculatedRating: number;

    @Prop()
    description: string;

    @Prop()
    advantages: string;

    @Prop()
    disAdvantages: string;

    @Prop({ type: () => [String] })
    categories: string[];

    @Prop({ type: () => [String] })
    tags: string[];

    @Prop({ type: () => [Productcharacteristic], _id: false })
    characteristics: Productcharacteristic[];
}

export type ProductDocument = ProductModel & Document;

export const ProductSchema = SchemaFactory.createForClass(ProductModel);
