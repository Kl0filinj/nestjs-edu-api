import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { TopPageModel } from './top-page.model';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { TopPageService } from './top-page.service';

@Controller('top-page')
export class TopPageController {
    constructor(private readonly topPageService: TopPageService) {}

    @UsePipes(new ValidationPipe())
    @Post('create')
    async create(@Body() dto: CreateTopPageDto) {}

    @Get(':id')
    async get(@Param('id', IdValidationPipe) id: string) {}

    @Delete(':id')
    async delete(@Param('id', IdValidationPipe) id: string) {}

    @UsePipes(new ValidationPipe())
    @Patch(':id')
    async patch(
        @Param('id', IdValidationPipe) id: string,
        @Body() dto: CreateTopPageDto,
    ) {}

    @HttpCode(200)
    @Post()
    async find(@Body() dto: FindTopPageDto) {}
}
