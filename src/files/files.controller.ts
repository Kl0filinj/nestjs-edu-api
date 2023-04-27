import {
    Controller,
    HttpCode,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { FileElementResponse } from './dto/file-element.response';
import { FilesService } from './files.service';
import { MFile } from './mfile.class';

@Controller('files')
export class FilesController {
    constructor(private readonly fileService: FilesService) {}

    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('files'))
    @Post('upload')
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
    ): Promise<FileElementResponse[]> {
        const saveArr = [new MFile(file)];
        if (file.mimetype.includes('image')) {
            const webP = await this.fileService.convertToWebp(file.buffer);
            saveArr.push(
                new MFile({
                    originalname: `${file.originalname.split('.')[0]}.webp`,
                    buffer: webP,
                }),
            );
        }
        return this.fileService.saveFiles(saveArr);
    }
}
