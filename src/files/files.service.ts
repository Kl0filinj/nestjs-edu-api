import { Injectable } from '@nestjs/common';
import { FileElementResponse } from './dto/file-element.response';
import { format } from 'date-fns';
import * as path from 'path';
import * as sharp from 'sharp';
import { ensureDir, writeFile } from 'fs-extra';
import { MFile } from './mfile.class';

@Injectable()
export class FilesService {
    async saveFiles(files: MFile[]): Promise<FileElementResponse[]> {
        const dateFolder = format(new Date(), 'yyyy-MM-dd');
        const rootPath = path.join(__dirname, '..', '..', 'src');
        const uploadFolder = `${rootPath}/uploads/${dateFolder}`;
        await ensureDir(uploadFolder);

        const res: FileElementResponse[] = [];
        for (const file of files) {
            await writeFile(
                `${uploadFolder}/${file.originalname}`,
                file.buffer,
            );
            res.push({
                url: `${uploadFolder}/${file.originalname}`,
                name: file.originalname,
            });
        }
        return res;
    }

    async convertToWebp(file: Buffer) {
        return sharp(file).webp().toBuffer();
    }
}
