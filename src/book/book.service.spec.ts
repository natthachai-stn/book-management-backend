import { Test, TestingModule } from '@nestjs/testing'
import { BookService } from './book.service'
import { BookController } from './book.controller'
import { BookRepository } from './book.repository'
import { responseException } from '../exception/response.exception'
import { CreateBookDto } from './dto/create-book.dto'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { GetBookDto } from './dto/get-book.dto'
import { UpdateBookDto } from './dto/update-book.dto'

const mockBookRepository = () => ({
  insert: jest.fn(),
  findAndCount: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
})

describe('BookService', () => {
  let service: BookService
  let repository: ReturnType<typeof mockBookRepository>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        BookService,
        {
          provide: BookRepository,
          useFactory: mockBookRepository,
        }
      ],
    }).compile()

    service = module.get<BookService>(BookService)
    repository = module.get(BookRepository)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a book successfully', async () => {
      repository.insert.mockResolvedValueOnce({ id: 1 })

      const dto: CreateBookDto = {
        title: 'Unit Test 101',
        author: 'Mockup',
        id: 0,
        published_year: 0,
        genre: 'MockType',
        created_at: new Date(),
        updated_at: new Date(),
      }
      const result = await service.create(dto)

      expect(repository.insert).toHaveBeenCalledWith(dto)
      expect(result).toEqual(responseException('Book created successfully'))
    })

    it('should throw BadRequestException if insert fails', async () => {
      repository.insert.mockResolvedValueOnce(null)

      const dto: CreateBookDto = {
        title: 'Unit Test fail',
        author: 'Mockup',
        id: 0,
        published_year: 0,
        genre: 'MockType',
        created_at: new Date(),
        updated_at: new Date(),
      }

      await expect(service.create(dto)).rejects.toThrow(BadRequestException)
    })
  })

  describe('findAll', () => {
    it('should return books and total', async () => {
      const books = [{ id: 1, title: 'Avengers', author: 'Sam Wilson' }]
      repository.findAndCount.mockResolvedValueOnce([books, 1])

      const query: GetBookDto = {
        skip: 0,
        pageSize: 10,
        page: 1
      }

      const result = await service.findAll(query)

      expect(repository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        order: { id: 'asc' },
      })

      expect(result).toEqual(responseException('Get Book successfully', books, 1))
    })

    it('should return not found response if no data', async () => {
      repository.findAndCount.mockResolvedValueOnce([[], 0])

      const result = await service.findAll({ skip: 0, pageSize: 10 } as GetBookDto)

      expect(result).toEqual(responseException('Book not found'))
    })
  })

  describe('update', () => {
    it('should update a book successfully', async () => {
      repository.update.mockResolvedValueOnce({ affected: 1 })

      const result = await service.update(1, {
        title: 'Nestjs Updated',
        id: 5,
        author: 'Node.js',
        published_year: 2010,
        genre: 'Programming',
      } as UpdateBookDto
      )

      expect(result).toEqual(responseException('Book updated successfully'))
    })

    it('should throw NotFoundException if update fails', async () => {
      repository.update.mockResolvedValueOnce({ affected: 0 })

      await expect(service.update(15, {
        title: 'Fail update',
        id: 5,
        author: 'Jest',
        published_year: 1950,
        genre: 'Test',
      } as UpdateBookDto)).rejects.toThrow(NotFoundException)
    })
  })

  describe('remove', () => {
    it('should delete a book successfully', async () => {
      repository.delete.mockResolvedValueOnce({ affected: 1 })

      const result = await service.remove(1)

      expect(result).toEqual(responseException('Book #1 has been deleted'))
    })

    it('should throw NotFoundException if delete fails', async () => {
      repository.delete.mockResolvedValueOnce({ affected: 0 })

      await expect(service.remove(999)).rejects.toThrow(NotFoundException)
    })
  })
})
