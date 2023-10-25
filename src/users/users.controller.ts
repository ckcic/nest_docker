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

@Controller('users')
// @UseFilters(HttpExceptionFilter)  // 특정 컨트롤러 전체 적용
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,  // AuthService 주입
    // @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,
    // @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    @Inject(Logger) private readonly logger: LoggerService
  ) {}

  // @UseFilters(HttpExceptionFilter)  // 특정 엔드포인트 적용
  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    // this.printWinstonLog(dto);
    this.printLoggerServiceLog(dto);
    await this.usersService.createUser(dto);
  }

  // private printWinstonLog(dto) {
  //   // console.log(this.logger.name); // 오류 
  //   // https://choi-records.tistory.com/entry/NestJS-Logger

  //   this.logger.error('error: ', dto);
  //   this.logger.warn('warn: ', dto);
  //   this.logger.info('info: ', dto);
  //   this.logger.http('http: ', dto);
  //   this.logger.verbose('verbose: ', dto);
  //   this.logger.debug('debug: ', dto);
  //   this.logger.silly('silly: ', dto);
  // }

  private printLoggerServiceLog(dto) {
    try {
      // throw new InternalServerErrorException('test');
    }
    catch (e) {
      this.logger.error('error: ' + JSON.stringify(dto), e.stack);
    }
    this.logger.warn('warn: ' + JSON.stringify(dto));
    this.logger.log('log: ' + JSON.stringify(dto));
    this.logger.verbose('verbose: ' + JSON.stringify(dto));
    this.logger.debug('debug: ' + JSON.stringify(dto));
  }

  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    return await this.usersService.verifyEmail(dto);
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    return await this.usersService.login(dto);
  }

  @Get(':id')
  async getUserInfo(@Headers() headers: any, @Param('id') userId: string): Promise<UserInfo> {
    const jwtString = headers.authorization.split('Bearer ')[1];  // 헤더에서 JWT 파싱

    this.authService.verify(jwtString); // JWT가 서버에서 발급한 것인지 검증

    return this.usersService.getUserInfo(userId);  // UsersService를 통해 유저 정보를 가져와서 응답으로 반환
  }


  // @Get('/:id')
  // async getUserInfo(@Param('id') userId: string): Promise<UserInfo> {
  //   return await this.usersService.getUserInfo(userId);
  // }

  // @Get(':id')
  // // findOne(@Param('id', ParseIntPipe) id: number) {
  // findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
  //   if (id < 1) { // '+id': TypeScript에서 문자열을 숫자로 형변환하는 방법 중 하나
  //     throw new BadRequestException('id는 0보다 큰 값이어야 합니다.', 'id format exception');
  //     // throw new HttpException(
  //     //   {
  //     //     errorMessage: 'id는 0보다 큰 정수여야 합니다.',
  //     //     foo: 'bar'
  //     //   },
  //     //   HttpStatus.BAD_REQUEST
  //     // );
  //   }

  //   return this.usersService.findOne(id);
  // }

    // @UseInterceptors(ErrorsInterceptor)
    // @Get(':id')
    // findOne(@Param('id') id: string) {
    //   throw new InternalServerErrorException();
    // }

  // @Get()
  // findAll(
  //   @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  //   @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  //   @Res() res: Response
  // ) {
  //   // console.log(offset, limit);
  //   const users = this.usersService.findAll();
  //   return res.status(200).send(users);
  // }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // @Redirect('https://nestjs.com', 301) // 요청을 보내고 다른페이지로 이동
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   if (+id < 1) { // '+id': TypeScript에서 문자열을 숫자로 형변환하는 방법 중 하나
  //     throw new BadRequestException('id는 0보다 큰 값이어야 합니다.')
  //   }

  //   return this.usersService.findOne(+id);
  // }


  // curl http://localhost:5000/users/1 -v
  // @Header('Custom', 'Test Header')
  // @Get(':id')
  // findOneWithHeader(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

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
