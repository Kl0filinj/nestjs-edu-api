import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { TopPageModule } from './top-page/top-page.module';
import { ReviewModule } from './review/review.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { TypegooseModule } from 'nestjs-typegoose';
// import { getMongoConfig } from './configs/mongo.config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get('DB_HOST'),
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }),
        }),
        AuthModule,
        ProductModule,
        TopPageModule,
        ReviewModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
