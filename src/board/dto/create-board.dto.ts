import { Transform } from "class-transformer";
import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateBoardDto {
  @Transform(params => {
    return params.value.trim();
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  readonly name: string;
}
