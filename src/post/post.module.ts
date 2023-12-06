import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post } from './entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [PostController],
  imports: [TypeOrmModule.forFeature([Post])],
  providers: [PostService],
})
export class PostModule {}
