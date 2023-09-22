import { Response } from 'express';
import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpCode, BadRequestException, Header, Redirect, Query, ParseIntPipe, HttpStatus, DefaultValuePipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserLoginDto, VerifyEmailDto } from './dto';
import { UserInfo } from './UserInfo';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    await this.usersService.createUser(dto);
  }

  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    return await this.usersService.verifyEmail(dto);
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    return await this.usersService.login(dto);
  }


  // @Get('/:id')
  // async getUserInfo(@Param('id') userId: string): Promise<UserInfo> {
  //   return await this.usersService.getUserInfo(userId);
  // }

  @Get(':id')
  // findOne(@Param('id', ParseIntPipe) id: number) {
  findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    if (id < 1) { // '+id': TypeScript에서 문자열을 숫자로 형변환하는 방법 중 하나
      throw new BadRequestException('id는 0보다 큰 값이어야 합니다.')
    }

    return this.usersService.findOne(id);
  }



  @Get()
  findAll(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Res() res: Response
  ) {
    // console.log(offset, limit);
    const users = this.usersService.findAll();

    return res.status(200).send(users);
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
