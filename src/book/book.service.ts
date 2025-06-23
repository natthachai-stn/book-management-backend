import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entity/book.entity';
import { Repository } from 'typeorm';
import { GetBookDto } from './dto/get-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) { }

  async create(createBookDto: CreateBookDto) {
    const result = await this.bookRepository.insert(createBookDto)
    if (!result) {
      throw new BadRequestException('Failed to create book');
    }

    return { message: 'Book created successfully' }
  }

  async findAll(query: GetBookDto) {
    const page = query.page || 1;
    const limit = query.pageSize || 10;

    const [data, total] = await this.bookRepository.findAndCount({
      skip: query.skip,
      take: limit,
      order: { id: 'asc' },
    });

    return {
      data,
      total,
      page,
    };
  }

  async findOne(id: number) {
    return await this.bookRepository.findOneBy({ id });
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    await this.bookRepository.update(id, updateBookDto);
    return await this.bookRepository.findOneBy({ id });
  }

  async remove(id: number) {
    await this.bookRepository.delete({ id });
    return { message: `Book #${id} has been deleted` };
  }
}
