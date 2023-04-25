import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

const rootPath = path.join(__dirname, '..', '..', 'src', 'uploads');

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath,
            serveRoot: '/static',
        }),
    ],
    providers: [FilesService],
    controllers: [FilesController],
})
export class FilesModule {}
