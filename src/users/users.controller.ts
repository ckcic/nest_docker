import { Response } from 'express';
import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpCode, BadRequestException, Headers, Redirect, Query, ParseIntPipe, HttpStatus, DefaultValuePipe, Inject, LoggerService, InternalServerErrorException, Logger, HttpException, UseFilters, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserLoginDto, VerifyEmailDto } from './dto';
import { UserInfo } from './UserInfo';
import { AuthService } from 'src/auth/auth.service';
import { Logger as WinstonLogger } from 'winston';
import { WINSTON_MODULE_NEST_PROVIDER, WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { HttpExceptionFilter } from '../exception/http-exception.filter';
import { ErrorsInterceptor } from 'src/interceptor/error.interceptor';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './command/create-user.command';
import { GetUserInfoQuery } from './query/get-user-info.query';
import { LoginCommand, VerifyAccessTokenCommand, VerifyEmailCommand } from './command';

@Controller('users')
// @UseFilters(HttpExceptionFilter)  // 특정 컨트롤러 전체 적용
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,  // AuthService 주입
    // @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,
    // @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    @Inject(Logger) private readonly logger: LoggerService,
    private commandBus: CommandBus, // @nest/cqrs 패키지에서 제공하는 CommandBus를 주입
    private queryBus: QueryBus,
  ) {}

  // @UseFilters(HttpExceptionFilter)  // 특정 엔드포인트 적용
  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    // this.printWinstonLog(dto);
    this.printLoggerServiceLog(dto);

    const { name, email, password } = dto;

    const command = new CreateUserCommand(name, email, password);

    // await this.usersService.createUser(dto);

    return this.commandBus.execute(command);  // 이전에 정의한 CreateUserCommand를 전송
  }


  private printLoggerServiceLog(dto) {
    try {
      // throw new InternalServerErrorException('test');
    }
    catch (e) {
      this.logger.error('error: ' + JSON.stringify(dto), e.stack);
    }
    // this.logger.warn('warn: ' + JSON.stringify(dto));
    // this.logger.log('log: ' + JSON.stringify(dto));
    // this.logger.verbose('verbose: ' + JSON.stringify(dto));
    this.logger.debug('debug: ' + JSON.stringify(dto));
  }

  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;
    
    const command = new VerifyEmailCommand(signupVerifyToken);
    
    return this.commandBus.execute(command);
    // return await this.usersService.verifyEmail(dto);
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;

    const command = new LoginCommand(email, password);;

    return this.commandBus.execute(command);
    // return await this.usersService.login(dto);
  }

  @Get(':id')
  async getUserInfo(@Headers() headers: any, @Param('id') userId: string): Promise<UserInfo> {
    const jwtString = headers.authorization.split('Bearer ')[1];  // 헤더에서 JWT 파싱

    const command = new VerifyAccessTokenCommand(jwtString);

    this.commandBus.execute(command);
    // this.authService.verify(jwtString); // JWT가 서버에서 발급한 것인지 검증


    const getUserInfoQuery = new GetUserInfoQuery(userId);

    return this.queryBus.execute(getUserInfoQuery)
    // return this.usersService.getUserInfo(userId);  // UsersService를 통해 유저 정보를 가져와서 응답으로 반환
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @HttpCode(202)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
