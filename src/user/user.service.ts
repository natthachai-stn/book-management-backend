import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async hash(password: string): Promise<string> {
    const saltOrRounds = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.insert({
      ...createUserDto,
      password: await this.hash(createUserDto.password)
    })

    if (!user.raw) {
      throw new BadRequestException('Failed to create user');
    }

    return {
      message: 'User created successfully',
    }
  }

  async findOne(email: string) {
    const user = await this.userRepository.findOne({ where: { email } })
    return user
  }

}
