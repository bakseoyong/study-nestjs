import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF',
  MEMBER = 'MEMEBER',
}

@Entity({ name: 'user_profiles' })
@Unique(['user'])
export class UserProfile extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({})
  @OneToOne(() => User, (user) => user.userProfile, { cascade: true })
  @JoinColumn()
  user: User;

  @ApiProperty({
    example: Role.MEMBER,
    description: '유저 등급',
  })
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.MEMBER,
  })
  role: Role;

  @ApiProperty({
    example: 'bakseoyong',
    description: '유저 아이디',
  })
  @Column({ type: 'varchar', length: 12, unique: true, comment: 'Id' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(12)
  @Matches(/^[A-Za-z][A-Za-z0-9]*$/, {
    message: 'Enter an ID that does not follow the format',
  })
  uid: string;

  @ApiProperty({
    example: 'Q1w2e3r4!',
    description: '유저 비밀번호',
  })
  @Column({ type: 'varchar', length: 65, comment: 'Password' })
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

  @ApiProperty({
    example: 'test@test.com',
    description: '이메일',
  })
  @Column({
    type: 'varchar',
    length: 30,
    unique: true,
    comment: 'Email Address',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @Matches(/^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/, {
    message: 'Enter a email that not follow the format',
  })
  email: string;

  @ApiProperty({
    example: '010-0000-0000',
    description: '핸드폰 번호',
  })
  @Column({
    type: 'varchar',
    length: 15,
    nullable: true,
    comment: 'Phone Number',
  })
  @IsOptional()
  @IsString()
  @MaxLength(15)
  @Matches(/01[016789]-[^0][0-9]{2,3}-[0-9]{3,4}/, {
    message: 'Enter a phone that not follow the format',
  })
  phone: string;

  @CreateDateColumn({ name: 'created', comment: 'Created Date' })
  created: Date;

  @UpdateDateColumn({ name: 'updated', comment: 'Updated Date' })
  updated: Date;

  @DeleteDateColumn({ name: 'deleted', comment: 'Deleted Date' })
  deleted: Date;
}
