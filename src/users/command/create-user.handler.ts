import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { CreateUserCommand } from "./create-user.command";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../entities/user.entity";
import { DataSource, Repository } from "typeorm";
import * as uuid from 'uuid';
import { ulid } from 'ulid';
import { UserCreatedEvent } from "../event/user-created.event";
import { TestEvent } from "../event/test.event";
import * as bcrypt from 'bcrypt';


@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private dataSource: DataSource,
    private eventBus: EventBus,
    @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,
  ) {}

  async execute(command: CreateUserCommand): Promise<any> {
    const { name, email, password } = command;

    const userExist = await this.checkUserExists(email);
    const nameExist = await this.checkNameExists(name);

    if (userExist) {
      throw new UnprocessableEntityException('해당 이메일로는 가입할 수 없습니다.');
    }

    if (nameExist) {
      throw new UnprocessableEntityException('이미 사용중인 닉네임입니다.');
    }

    const signupVerifyToken = uuid.v1();



    await this.saveUserUsingTransaction(name, email, password, signupVerifyToken);

    this.eventBus.publish(new UserCreatedEvent(email, signupVerifyToken));
    this.eventBus.publish(new TestEvent());
  }

  private async checkUserExists(email:string): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: {email}
    });
    // console.log("user", user);
    return user !== null;
  }

  private async checkNameExists(name: string): Promise<boolean> {
    const user = await this.usersRepository.findOneBy({name});
    return user !== null;
  }

  // private async saveUserUsingQueryRunner(name: string, email:string, password: string, signupVerifyToken: string) {
  //   const queryRunner = this.dataSource.createQueryRunner();  // 주입받은 DataSource 객체에서 QueryRunner 생성

  //   await queryRunner.connect();  // QueryRunner에서 DB에 연결 
  //   await queryRunner.startTransaction(); // 트랜잭션 시작

  //   try {
  //     const user = new UserEntity();  // 새로운 유저 엔티티 객체를 생성
  //     user.id = ulid(); // npm i ulid, 랜덤한 스트링 생성
  //     user.name = name; 
  //     user.email = email;
  //     user.password = password;
  //     user.signupVerifyToken = signupVerifyToken;

  //     await queryRunner.manager.save(user);  // 정상 동작을 수행했다면  트랜잭션을 커밋하여 영속화 합니다

  //     // throw new InternalServerErrorException(); // 일부러 에러 발생   // 이 과정에서 에러가 발생하면 직접 롤백을 수행 합니다.

  //     await queryRunner.commitTransaction();  // DB 작업을 수행한 후 커밋을 해서 영속화 완료

  //     return false;
  //   } catch (e) {
  //     // 에러가 발생하면 롤백
  //     await queryRunner.rollbackTransaction();  // 롤백
  //     return true;
  //   } finally {
  //     // 직접 생성한 QueryRunner는 해제시켜주어야 함
  //     await queryRunner.release();  // QueryRunner 객체 해제
  //   }
  // }

  private async saveUserUsingTransaction(name: string, email:string, password: string, signupVerifyToken: string) {
    await this.dataSource.transaction(async manager => {
      const saltOrRounds = 10;
      const hash = await bcrypt.hash(password, saltOrRounds);

      const user = new UserEntity();  // 새로운 유저 엔티티 객체를 생성
      user.id = ulid(); // npm i ulid, 랜덤한 스트링 생성
      user.name = name; 
      user.email = email;
      user.password = hash;
      user.signupVerifyToken = signupVerifyToken;

      await manager.save(user);
    });
  }
}