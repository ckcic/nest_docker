import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const {writer, boardId, title, content} = createPostDto;
    
    await this.postRepository.save({
      writer,
      boardId,
      title,
      content
    })
  }

  async findAll(boardId: number) {
    const posts = await this.postRepository
    .createQueryBuilder('post')
    .leftJoinAndSelect('post.user', 'user')
    .select(['post', 'user.name'])
    .where('boardId = :boardId', {boardId})
    .orderBy('post.createdAt', 'DESC')
    .getMany();
    return posts;
  }

  async findOne(id: number) {
    let {hit} = await this.postRepository
    .createQueryBuilder('post')
    .where("id = :id", {id})
    .getOne();

    await this.postRepository
    .createQueryBuilder()
    .update(Post)
    .set({hit: hit+1 })
    .where("id = :id", {id})
    .execute();
    
    const post = await this.postRepository
    .createQueryBuilder('post')
    .leftJoinAndSelect('post.user', 'user')
    .select(['post', 'user.name'])
    .where("post.id = :id", {id})
    .getOne();

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const {writer, boardId, title, content} = updatePostDto;
    
    await this.postRepository.update(id ,{
      writer,
      boardId,
      title,
      content
    })
  }

  async remove(id: number) {
    await this.postRepository.delete(id);
  }
}
