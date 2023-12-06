import { BadRequestException } from "@nestjs/common";
import { Transform } from "class-transformer";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { NotIn } from "../../utils/decorators/not-in";

export class CreateUserDto {
  @Transform(params => {
    // console.log(params);
    return params.value.trim();
  })
  @NotIn('password', {message: 'password는 name과 같은 문자열을 포함할 수 없습니다.'})
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  readonly name: string; // 사용자 이름은 2자 이상 30자 이하인 문자열
  
  @Transform(params => params.value.trim())
  @IsString()
  @IsEmail() 
  @MaxLength(60)
  readonly email: string; // 사용자 이메일은 60자 이하의 문자열로서 이메일 주소 형식에 적합해야함
  
  // @Transform(({ value, obj }) => {
  //   if(obj.password.includes(obj.name.trim())) {
  //     throw new BadRequestException('password는 name과 같은 문자열을 포함할 수 없습니다.')
  //   }
  //   return value.trim();
  // })
  @Transform(params => params.value.trim())
  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/, {message: "패스워드는 영문 대소문자와 숫자 또는 특수문자(!, @, $, %, ^, &, *, (, ))로 이뤄잔 8자 이상 30자 이하의 문자열이어야 합니다."}) // 정규표현식 \d는 숫자를 대표하는 정규표현식 digit
  readonly password: string; // 사용자 패스워드는 영문 대소문자와 숫자 또는 특수문자(!, @, $, %, ^, &, *, (, ))로 이뤄잔 8자 이상 30자 이하의 문자열
}
