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
import { ProductModel } from './product.model';
import { FindProductDto } from './dto/find-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { PRODUCT_NOT_FOUND } from './product.constants';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    @Post('create')
    async create(@Body() dto: CreateProductDto) {
        return await this.productService.create(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async get(
        @Param('id', IdValidationPipe) id: string,
    ): Promise<ProductModel> {
        const product = await this.productService.findById(id);

        if (!product) {
            throw new HttpException(PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        return product;
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id', IdValidationPipe) id: string) {
        const deletedProduct = await this.productService.deleteById(id);
        if (!deletedProduct) {
            throw new HttpException(PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        return deletedProduct;
    }

    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    @Patch(':id')
    async patch(
        @Param('id', IdValidationPipe) id: string,
        @Body() dto: ProductModel,
    ) {
        const updatedProduct = await this.productService.updateById(dto, id);

        if (!updatedProduct) {
            throw new HttpException(PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        return updatedProduct;
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post('find')
    async find(@Body() dto: FindProductDto) {
        return this.productService.findWithReviews(dto);
    }
}
