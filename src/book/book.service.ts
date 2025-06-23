import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { GetBookDto } from './dto/get-book.dto';
import { BookRepository } from './book.repository';
import { responseException } from '../exception/response.exception';
import { Book } from './entity/book.entity';

@Injectable()
export class BookService {
  constructor(
    private readonly bookRepository: BookRepository
  ) { }

  async create(createBookDto: CreateBookDto) {
    const result = await this.bookRepository.insert(createBookDto)
    if (!result) {
      throw new BadRequestException('Failed to create book');
    }
    return responseException('Book created successfully')
  }

  async findAll(query: GetBookDto) {
    const limit = query.pageSize || 10;

    const [data, total] = await this.bookRepository.findAndCount({
      skip: query.skip,
      take: limit,
      order: { id: 'asc' },
    });
    if (!data || !data.length) {
      return responseException<Book>('Book not found');
    }

    return responseException('Get Book successfully', data, total)
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const result = await this.bookRepository.update(id, updateBookDto);
    if (!result.affected) {
      throw new NotFoundException('Book not found or update failed');
    }
    return responseException('Book updated successfully')
  }

  async remove(id: number) {
    const result = await this.bookRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException('Book not found for delete');
    }
    return responseException(`Book #${id} has been deleted`)
  }
}
