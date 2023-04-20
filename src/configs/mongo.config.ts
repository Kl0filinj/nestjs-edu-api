import { ConfigService } from '@nestjs/config';
// import { MongoClient } from 'mongodb';
// import { TypegooseModuleOptions } from 'nestjs-typegoose';

// export const getMongoConfig = async (
//     configService: ConfigService,
// ): Promise<TypegooseModuleOptions> => {
//     return {
//         uri: configService.get('DB_HOST'),
//         ...getMongoOptions(),
//     };
// };

// const getMongoOptions = () => ({
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });
// export const getMongoClient = async (configService: ConfigService) => {
//     const uri = configService.get('DB_HOST');

//     const client = new MongoClient(uri, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     });

//     try {
//         await client.connect();
//         console.log('Connected to MongoDB');
//         return client;
//     } catch (error) {
//         console.error('Error connecting to MongoDB:', error);
//     }
// };
