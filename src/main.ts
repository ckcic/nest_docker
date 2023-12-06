import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { logger3 } from './logger/logger3.middleware';
import { AuthGuard } from './auth.guard';
import { MyLogger } from './logging/my-logger.service';
import { utilities as nestWinstonModuleUtilities, WinstonModule, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as winston from 'winston';
import { HttpExceptionFilter } from './exception/http-exception.filter';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // logger: false,  // false로 할 시 로깅 비활성화
    // logger: process.env.NODE_ENV === 'production' 
    // ? ['error', 'warn', 'log']  // 프로덕션 환경에서는 debug 로그가 남지 않도록 하는게 좋다.
    // : ['error', 'warn', 'log', 'verbose', 'debug']
    logger: WinstonModule.createLogger({
      transports: [ // transports 옵션을 설정
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',  // 로그 레벨을 개발 환경에 따라 다르도록 지정
          format: winston.format.combine(
            winston.format.timestamp(), // 로그를 남긴 시각을 함께 표시하도록 설정
            nestWinstonModuleUtilities.format.nestLike('MyApp', { prettyPrint: true }), 
            // 어디에서 로그를 남겼는지 구분하는 appName('MyApp')과 로그를 읽기 쉽도록 하는 옵션인 prettyPrint 옵션을 설정
          ),
        }),
      ],
    })
  });

  const uploadPath = 'uploads';
  if (!existsSync(uploadPath)) {
    mkdirSync(uploadPath);
  }

  app.useStaticAssets('/uploads');
  app.useStaticAssets(join(__dirname, '../', 'uploads'), {
    prefix: '/uploads'
  });

  // app.useGlobalGuards(new AuthGuard()); // 전역가드 설정
  // app.useLogger(app.get(MyLogger));
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  })); 
  // app.use(logger3)
  // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))
  // app.useGlobalFilters(new HttpExceptionFilter()); // 전역 필터 적용
  // app.useGlobalInterceptors(
  //   // new LoggingInterceptor(),
  //   // new TransformInterceptor(),
  // );

  app.enableCors();

  await app.listen(5000);
} 

bootstrap();
