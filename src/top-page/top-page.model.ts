import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export enum TopLevelCategory {
    Courses,
    Services,
    Books,
    Products,
}

export class HhData {
    @Prop()
    count: number;

    @Prop()
    juniorSalary: number;

    @Prop()
    middleSalary: number;

    @Prop()
    seniorSalary: number;
}

export class TopPageAdvantage {
    @Prop()
    title: string;

    @Prop()
    description: string;
}

@Schema({ timestamps: true })
export class TopPageModel {
    @Prop({ type: mongoose.Types.ObjectId })
    _id: string;

    @Prop({ enum: TopLevelCategory })
    firstCategory: TopLevelCategory;

    @Prop()
    secondCategory: string;

    @Prop({ unique: true })
    alias: string;

    @Prop()
    title: string;

    @Prop()
    category: string;

    @Prop({ type: HhData })
    hh?: HhData;

    @Prop({ type: () => [TopPageAdvantage] })
    advantages: TopPageAdvantage[];

    @Prop()
    seoText: string;

    @Prop()
    tagsTitle: string;

    @Prop({ type: () => [String] })
    tags: string[];
}

export type TopPageDocument = TopPageModel & Document;

export const TopPageSchema = SchemaFactory.createForClass(TopPageModel);
