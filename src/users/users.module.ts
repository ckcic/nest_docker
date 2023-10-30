import { Logger, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { EmailModule } from 'src/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserHandler, LoginHandler, VerifyAccessTokenHandler, VerifyEmailHandler } from './command';
import { GetUserInfoQueryHandler } from './query';
import { UserEventsHandler } from './event';

const commandHandlers = [
  CreateUserHandler,
  LoginHandler,
  VerifyAccessTokenHandler,
  VerifyEmailHandler
];

const queryHandlers = [
  GetUserInfoQueryHandler,
];

const eventHandlers = [
  UserEventsHandler,
];

@Module({
  imports: [
    EmailModule,
    TypeOrmModule.forFeature([UserEntity]), // UsersModule에서 forFeature() 메서드로 유저 모듈 내에서 사용할 저장소를 등록
    AuthModule,
    CqrsModule,
  ], 
  controllers: [UsersController],
  providers: [
    UsersService,
    ...commandHandlers, 
    ...queryHandlers,
    ...eventHandlers,
    Logger,
  ],
})
export class UsersModule {}
