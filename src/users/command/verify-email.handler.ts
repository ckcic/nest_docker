import { Injectable, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../entities/user.entity";
import { Repository } from "typeorm";
import { AuthService } from "src/auth/auth.service";
import { VerifyEmailCommand } from "./verify-email.command";

@Injectable()
@CommandHandler(VerifyEmailCommand)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailCommand> {
  constructor(
    @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  async execute(command: VerifyEmailCommand ) {
    const { signupVerifyToken } = command;  

    const user = await this.usersRepository.findOne({ // signupVerifyToken으로 회원 가입 중인 유저를 찾습니다.
      where: { signupVerifyToken }
    });

    if(!user) { // 만약 DB에 저장되어 있지 않다면 에러를 던집니다.
      throw new NotFoundException('유저가 존재하지 않습니다');
    }

    return this.authService.login({ // AuthService에 로그인 처리를 요청합니다.
      id: user.id,
      name: user.name,
      email: user.email,
      permission: user.permission,
    });
  }
}