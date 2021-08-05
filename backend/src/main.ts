import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as Sentry from '@sentry/node';
import { eventContext } from 'aws-serverless-express/middleware';
import * as bodyParser from 'body-parser';
import { Express } from 'express';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserActiveGuard } from './guards/user-active.guard';
import { SentryInterceptor } from './sentry.interceptor';
import { UserService } from './user/user.service';

export async function setupSwagger(app: INestApplication, prefix?: string) {
  let options = new DocumentBuilder().setTitle('ZenBrief Backend').setVersion('1.1').addBearerAuth();
  if (prefix) options = options.addServer(prefix);
  const document = SwaggerModule.createDocument(app, options.build());
  SwaggerModule.setup('api', app, document);
}

export async function bootstrap(expressApp?: Express): Promise<INestApplication> {
  let app: INestApplication;
  if (expressApp) {
    app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
    app.use(eventContext());
  } else {
    app = await NestFactory.create(AppModule);
  }
  const configService: ConfigService = app.get(ConfigService);
  app.use(helmet());
  app.use('/bill/webhook', bodyParser.raw({ type: 'application/json' }));
  app.enableCors();
  app.useGlobalGuards(
    new JwtAuthGuard(app.get(Reflector)),
    new UserActiveGuard(app.get(Reflector), app.get(UserService)),
  );
  Sentry.init({ dsn: configService.get<string>('sentryDsn') });
  app.useGlobalInterceptors(new SentryInterceptor());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  if (expressApp) {
    return app;
  } else {
    setupSwagger(app);
    await app.listen(configService.get<number>('port'));
  }
}
bootstrap();