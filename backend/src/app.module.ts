import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import AreaModule from './area/area.module';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { HttpMicroserviceModule } from './http-microservice/http-microservice.module';
import { ReportModule } from './report/report.module';
import { CitizenModule } from './user/citizen/user.module';
import { RepresentativeModule } from './user/representative/user.module';
import { VoteModule } from './vote/vote.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('db.uri'),
        useFindAndModify: false,
        useCreateIndex: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    AreaModule,
    ReportModule,
    VoteModule,
    // UserModule,
    RepresentativeModule,
    CitizenModule,
    HttpMicroserviceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
