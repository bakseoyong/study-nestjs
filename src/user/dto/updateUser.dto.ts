import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
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

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @Matches(/^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/, {
    message: 'Enter a email that not follow the format',
  })
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  @Matches(/01[016789]-[^0][0-9]{2,3}-[0-9]{3,4}/, {
    message: 'Enter a phone that not follow the format',
  })
  phone: string;
}
