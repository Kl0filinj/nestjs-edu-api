import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpException,
    HttpStatus,
    Param,
    Patch,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { TopPageModel } from './top-page.model';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { TopPageService } from './top-page.service';
import { TOP_PAGE_NOT_FOUND } from './top-page.constants';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('top-page')
export class TopPageController {
    constructor(private readonly topPageService: TopPageService) {}

    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    @Post('create')
    async create(@Body() dto: CreateTopPageDto) {
        return this.topPageService.create(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async get(@Param('id', IdValidationPipe) id: string) {
        const topPage = await this.topPageService.findById(id);

        if (!topPage) {
            throw new HttpException(TOP_PAGE_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        return topPage;
    }

    @Get('byAlias/:alias')
    async getByAlias(@Param('alias') alias: string) {
        const topPage = await this.topPageService.findByAlias(alias);
        if (!topPage) {
            throw new HttpException(TOP_PAGE_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        return topPage;
    }

    @HttpCode(200)
    @UsePipes(new ValidationPipe())
    @Post('find')
    async find(@Body() dto: FindTopPageDto) {
        return this.topPageService.findByCategory(dto.firstCategory);
    }

    @UseGuards(JwtAuthGuard)
    @Get('textSearch/:text')
    async textSearch(@Param('text') text: string) {
        return this.topPageService.findByText(text);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id', IdValidationPipe) id: string) {
        const deletedTopPage = await this.topPageService.delete(id);

        if (!deletedTopPage) {
            throw new HttpException(TOP_PAGE_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        return deletedTopPage;
    }

    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    @Patch(':id')
    async patch(
        @Param('id', IdValidationPipe) id: string,
        @Body() dto: CreateTopPageDto,
    ) {
        const updatedTopPage = await this.topPageService.updateById(dto, id);

        if (!updatedTopPage) {
            throw new HttpException(TOP_PAGE_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        return updatedTopPage;
    }
}
