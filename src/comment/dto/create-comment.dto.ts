import { Transform } from "class-transformer";
import { IsString, IsNumberString, MaxLength, MinLength, IsNotEmpty } from "class-validator";

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  readonly writer: string;

  @IsNumberString()
  @IsNotEmpty()
  readonly postId: number;

  @Transform(params => {
    return params.value.trim();
  })
  @IsString()
  @MinLength(2)
  @MaxLength(1000)
  readonly content: string;
}
