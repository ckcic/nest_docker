import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board) private boardRepository: Repository<Board>,
  ) {}

  async create(createBoardDto: CreateBoardDto) {
    const {name} = createBoardDto;

    const nameExist = await this.checkNameExists(name);

    if (nameExist) {
      throw new UnprocessableEntityException('이미 사용중인 이름입니다.');
    }

    await this.boardRepository.save({board_name: name})
  }

  async findAll(): Promise<Board[]> {
    const boards = await this.boardRepository.find({order:{createdAt: 'DESC'}})
    return boards;
  }

  async findOne(id: number) {
    return await this.boardRepository.findOneByOrFail({id});
  }

  async update(id: number, updateBoardDto: UpdateBoardDto) {
    const {name} = updateBoardDto;

    const nameExist = await this.checkNameExists(name);

    if (nameExist) {
      throw new UnprocessableEntityException('이미 사용중인 이름입니다.');
    }

    await this.boardRepository.update(id ,{ board_name: name })
  }

  async remove(id: number) {
    await this.boardRepository.delete(id);
  }

  private async checkNameExists(name:string): Promise<boolean> {
    const board = await this.boardRepository.findOne({
      where: {board_name: name}
    });
    return board !== null;
  }
}
