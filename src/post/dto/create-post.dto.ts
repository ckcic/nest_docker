import { Transform } from "class-transformer";
import { IsString, IsNumberString, MaxLength, MinLength, IsNotEmpty } from "class-validator";

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  readonly writer: string;
  
  @IsNumberString()
  @IsNotEmpty()
  readonly boardId: number;

  @Transform(params => {
    return params.value.trim();
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  readonly title: string;

  @Transform(params => {
    return params.value.trim();
  })
  @IsString()
  @MinLength(2)
  @MaxLength(1000)
  readonly content: string;
}
