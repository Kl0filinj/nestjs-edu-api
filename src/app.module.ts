import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { TopPageModule } from './top-page/top-page.module';
import { ReviewModule } from './review/review.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';

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
        LoggerModule.forRoot({
            pinoHttp: {
                customProps: (req, res) => ({
                    context: 'HTTP',
                }),
                transport: {
                    target: 'pino-pretty',
                    options: {
                        // singleLine: true,
                        // translateTime: true,
                        // ignore: 'pid,hostname,context',
                        // messageFormat: '{msg}',
                        colorize: true,
                        levelFirst: true,
                        minimumLevel: 'trace',
                        // crlf: true,
                        // errorLikeObjectKeys: ['err', 'error'],
                        // errorProps: '',
                        // messageKey: 'msg',
                        // messageFormat: '{levelLabel} - {pid} - url:{req.url}',
                        // timestampKey: 'time',
                        // useLevelLabels: true,
                    },
                },
            },
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
