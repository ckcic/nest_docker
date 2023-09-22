import { Module } from '@nestjs/common';
import { EmailModule } from 'src/email/email.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';

@Module({
  imports: [EmailModule, TypeOrmModule.forFeature([UserEntity])], // UsersModule에서 forFeature() 메서드로 유저 모듈 내에서 사용할 저장소를 등록
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
