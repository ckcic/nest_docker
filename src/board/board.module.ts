import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';

@Module({
  controllers: [BoardController],
  imports: [TypeOrmModule.forFeature([Board])],
  providers: [BoardService],
})
export class BoardModule {}
