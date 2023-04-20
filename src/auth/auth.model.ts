import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ versionKey: true, timestamps: true })
export class AuthModel {
    @Prop({ type: mongoose.Types.ObjectId })
    _id: string;

    @Prop()
    email: string;

    @Prop()
    passwordHash: string;
}

export type AuthDocument = AuthModel & Document;

export const AuthSchema = SchemaFactory.createForClass(AuthModel);
