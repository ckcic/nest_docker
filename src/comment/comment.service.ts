import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
  ){}

  async create(createCommentDto: CreateCommentDto) {
    const {writer, postId, content} = createCommentDto
    try {
      await this.commentRepository.save({
        writer,
        postId,
        content
      });
    } catch (e) {
      console.log(e);
    }
  }

  async findAll(postId: number) {
    try {
      const comments = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .select(['comment', 'user.name'])
      .where('postId = :postId', {postId})
      // .orderBy('comment.createdAt', 'DESC')
      .getMany();

      return comments;
    } catch (e) {
      console.log(e);
    }
  }

  async findOne(id: number) {
    try {
      return await this.commentRepository.findOneByOrFail({id});
    } catch (e) {
      console.log(e);
    }
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    const {writer, postId, content} = updateCommentDto
    try {
      await this.commentRepository.update(id, {
        writer,
        postId,
        content
      });
    } catch (e) {
      console.log(e);
    }
  }

  async remove(id: number) {
    try {
      await this.commentRepository.delete({id});
    } catch (e) {
      console.log(e);
    }
  }
}
