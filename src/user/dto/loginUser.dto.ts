import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(12)
  @Matches(/^[A-Za-z][A-Za-z0-9]*$/, {
    message: 'Enter an ID that does not follow the format',
  })
  id: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(16)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/,
    {
      message: 'Enter a password that not follow the format',
    },
  )
  password: string;
}
