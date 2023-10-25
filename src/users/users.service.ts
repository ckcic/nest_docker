import * as uuid from 'uuid';
import { Injectable, InternalServerErrorException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserLoginDto, VerifyEmailDto } from './dto';
import { EmailService } from 'src/email/email.service';
import { UserInfo } from './UserInfo';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { ulid } from 'ulid';
import { AuthService } from 'src/auth/auth.service';
import { async } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(
    private readonly emailService: EmailService, 
    @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,  // UsersService에 @InjectRepository 데커레이터로 유저 저장소를 주입
    private dataSource: DataSource, // typeorm에서 제공하는 DataSource 객체를 주입
    private readonly authService: AuthService,
    ) {}

  async createUser(dto:CreateUserDto) {
    const {name, email, password} = dto;
    const userExist = await this.checkUserExists(email);

    if (userExist) {
      throw new UnprocessableEntityException('해당 이메일로는 가입할 수 없습니다.');
    }

    const signupVerifyToken = uuid.v1();

    await this.saveUserUsingTransaction(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  private async checkUserExists(email:string): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: {email}
    });
    console.log("user", user);
    return user !== null;
  }

  private async saveUser(name: string, email:string, password: string, signupVerifyToken: string) {
    const user = new UserEntity();  // 새로운 유저 엔티티 객체를 생성
    user.id = ulid(); // npm i ulid, 랜덤한 스트링 생성
    user.name = name; 
    user.email = email;
    user.password = password;
    user.signupVerifyToken = signupVerifyToken;
    await this.usersRepository.save(user);  // 저장소를 이용해, 엔티티를 데이터베이스에 저장
  }

  private async saveUserUsingQueryRunner(name: string, email:string, password: string, signupVerifyToken: string) {
    const queryRunner = this.dataSource.createQueryRunner();  // 주입받은 DataSource 객체에서 QueryRunner 생성

    await queryRunner.connect();  // QueryRunner에서 DB에 연결 
    await queryRunner.startTransaction(); // 트랜잭션 시작

    try {
      const user = new UserEntity();  // 새로운 유저 엔티티 객체를 생성
      user.id = ulid(); // npm i ulid, 랜덤한 스트링 생성
      user.name = name; 
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await queryRunner.manager.save(user);  // 정상 동작을 수행했다면  트랜잭션을 커밋하여 영속화 합니다

      // throw new InternalServerErrorException(); // 일부러 에러 발생   // 이 과정에서 에러가 발생하면 직접 롤백을 수행 합니다.

      await queryRunner.commitTransaction();  // DB 작업을 수행한 후 커밋을 해서 영속화 완료

      return false;
    } catch (e) {
      // 에러가 발생하면 롤백
      await queryRunner.rollbackTransaction();  // 롤백
      return true;
    } finally {
      // 직접 생성한 QueryRunner는 해제시켜주어야 함
      await queryRunner.release();  // QueryRunner 객체 해제
    }
  }

  private async saveUserUsingTransaction(name: string, email:string, password: string, signupVerifyToken: string) {
    await this.dataSource.transaction(async manager => {
      const user = new UserEntity();  // 새로운 유저 엔티티 객체를 생성
      user.id = ulid(); // npm i ulid, 랜덤한 스트링 생성
      user.name = name; 
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await manager.save(user);

      // throw new InternalServerErrorException();
    });
  }


  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
  }

  async verifyEmail(dto: VerifyEmailDto): Promise<string> {
    // 1. DB에서 signupVerifyToken으로 회원 가입 처리중인 유저가 있는지 조회하고 없다면 에러 처리
    // 2. 바로 로그인 상태가 되도록 JWT를 발급
    const { signupVerifyToken } = dto;
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
    });
  }

  async login(dto:UserLoginDto): Promise<string> {
    // 1. email, password를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러 처리
    // 2. JWT를 발급
    const { email, password } = dto;

    const user = await this.usersRepository.findOne({
      where: {email, password}
    });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }

    return this.authService.login({ 
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  async getUserInfo(userId:string): Promise<UserInfo> {
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

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
