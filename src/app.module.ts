import { Logger, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import emailConfig from './config/emailConfig';
import { validationSchema } from './config/validationSchema';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from './logger/logger.middleware';
import { Logger2Middleware } from './logger/logger2.middleware';
import { UsersController } from './users/users.controller';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import authConfig from './config/authConfig';
import { LoggerModule } from './logging/logger.module';
import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities, WinstonModule} from 'nest-winston';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './exception/http-exception.filter';
import { ExceptionModule } from './exception/exception.module';
import { LoggingModule } from './interceptor/logging.module';
import { BatchModule } from './batch/batch.module';
import { HttpModule } from '@nestjs/axios';
import { TerminusModule } from '@nestjs/terminus';
import { HealthCheckController } from './health-check/health-check.controller';
import { DogHealthIndicator } from './health-check/dog.health';
import { BoardModule } from './board/board.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';



@Module({  
  imports: [
    UsersModule,
    ConfigModule.forRoot({
    envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],  // NODE_ENV값에 따라 다른 env파일 사용
    load: [emailConfig, authConfig],  // ※ ConfigFactory 지정 ※ 새로 만들고 사용할 때 지정 해야 함 
    isGlobal: true, // 전역 모듈 설정, 어느 모듈에서나 사용 할 수 있음, 필요하면 EmailModule에만 import
    validationSchema, // 환경 변수의 값에 대해 유효성 검사를 수행 joi를 이용하여 검사 객체를 작성
    }),
    TypeOrmModule.forRoot({ // Appmodule에 TypeOrmModule을 동적 모듈로 가져오기
      type: 'mysql',  // TypeOrmModule이 다루고자 하는 데이터베이스의 타입
      host: process.env.MYSQL_SERVER, // 연결할 데이터베이스 호스트의 주소
      port: 3306, // 데이터베이스에 연결을 위해 열어놓은 포트 번호
      username: process.env.MYSQL_USER, // 데이터베이스에 연결할 유저명
      password: process.env.MYSQL_PASSWORD, // 데이터베이스에 연결할 패스워드
      database: process.env.MYSQL_DATABASE, // 연결하고자 하는 데이터베이스 스키마 이름
      entities: [__dirname + '/**/*.entity{.ts,.js}'],  // 소스 코드 내에서 TypeOrm이 구동될 때 인식하도록 할 엔티티, 클래스의 경로를 지정
      synchronize: false,  // 옵션은 서비스 구동 시 소스 코드 기반으로 데이터베이스 스키마를 동기화할지 여부, true로 할 시 연결할 때 초기화
      migrationsRun: false, //서버가 구동될 때 작성된 마이그레이션 파일을 기반으로 마이그레이션을 수행하게 할지 설정하는 옵션, false로 설정하여 CLI 명령어를 직접 입력하게 설정
      migrations: [__dirname + '/**/migrations/*.js'],  // 마이그레이션을 수행할 파일이 관리되는 경로를 설정
      migrationsTableName: 'migrations',  // 마이그레이션 이력이 기록되는 테이블 이름, 생략할 경우 기본값은 migrations
    }),
    LoggerModule,
    ExceptionModule,
    LoggingModule,
    BatchModule,
    // WinstonModule.forRoot({
    //   transports: [ // transports 옵션을 설정
    //     new winston.transports.Console({
    //       level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',  // 로그 레벨을 개발 환경에 따라 다르도록 지정
    //       format: winston.format.combine(
    //         winston.format.timestamp(), // 로그를 남긴 시각을 함께 표시하도록 설정
    //         nestWinstonModuleUtilities.format.nestLike('MyApp', { prettyPrint: true }), 
    //         // 어디에서 로그를 남겼는지 구분하는 appName('MyApp')과 로그를 읽기 쉽도록 하는 옵션인 prettyPrint 옵션을 설정
            
    //         // [MyApp] Silly   10/25/2023, 12:05:23 PM silly:  - {
    //         //   name: 'YOUR_NAME',
    //         //   email: 'YOUR_EMAIL@gmail.com',
    //         //   password: 'pass123$'
    //         // }
    //       ),
    //     }),
    //   ],
    // }),
    TerminusModule,
    HttpModule,
    BoardModule,
    PostModule,
    CommentModule,
  ],
  controllers: [AppController,HealthCheckController], 
  providers: [AppService, 
    // Logger,
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter,
    // },
    DogHealthIndicator,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
    .apply(LoggerMiddleware, Logger2Middleware)
    // .exclude({path: '/users', method: RequestMethod.GET}) // /users 경로로 전달된 GET 요청일 때는 LoggerMiddleware, Logger2Middleware가 무시됨
    // .forRoutes('/users')
    .forRoutes(UsersController)
  }
}
