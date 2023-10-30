import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetUserInfoQuery } from "./get-user-info.query";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../entities/user.entity";
import { Repository } from "typeorm";
import { NotFoundException } from "@nestjs/common";
import { UserInfo } from "../UserInfo";

@QueryHandler(GetUserInfoQuery)
export class GetUserInfoQueryHandler implements IQueryHandler<GetUserInfoQuery> {
  constructor(
    @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,
  ) {}

  async execute(query: GetUserInfoQuery): Promise<UserInfo> {
    const { userId } = query;

    // 1. userId를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러 처리
    // 2. 조회된 데이터를 UserInfo 타입으로 응답
    const user = await this.usersRepository.findOne({
      where: {id: userId}
    });

    if(!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}