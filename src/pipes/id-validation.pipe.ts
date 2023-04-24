import {
    ArgumentMetadata,
    HttpException,
    HttpStatus,
    Injectable,
    PipeTransform,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { INCORRECT_ID_FORMAT } from './id-validation.constants';

// @Injectable()
export class IdValidationPipe implements PipeTransform {
    transform(value: string, metadata: ArgumentMetadata) {
        if (metadata.type !== 'param') {
            return;
        }
        if (!mongoose.Types.ObjectId.isValid(value)) {
            throw new HttpException(
                INCORRECT_ID_FORMAT,
                HttpStatus.BAD_REQUEST,
            );
        }
        return value;
    }
}
