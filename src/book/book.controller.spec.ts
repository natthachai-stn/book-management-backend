import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { responseException } from '../exception/response.exception';
import { UpdateBookDto } from './dto/update-book.dto';
import { GetBookDto } from './dto/get-book.dto';

describe('BookController', () => {
  let controller: BookController;
  let service: jest.Mocked<BookService>;

  const mockBookService = {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        {
          provide: BookService,
          useValue: mockBookService
        }
      ],
    }).compile();

    controller = module.get<BookController>(BookController)
    service = module.get<BookService>(BookService) as jest.Mocked<BookService>;
  });


  describe('create', () => {
    it('should call create', async () => {
      const dto = {
        id: 0,
        title: 'Youtuber101',
        author: 'Mr.Mock',
        genre: 'Tech',
        published_year: 2024,
      } as CreateBookDto

      const mockResponse = responseException('Book created successfully',);
      service.create.mockResolvedValue(mockResponse);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findAll', () => {
    it('should call findAll', async () => {
      const query: GetBookDto = {
        skip: 0,
        pageSize: 10,
        page: 1
      };
      const mockResponse = responseException('Get Book successfully', [
        {
          id: 2,
          author: "Tony Stark",
          genre: "Comic",
          published_year: 1999,
          title: "book1",
          created_at: new Date(),
          updated_at: new Date(),
        }
      ], 1);

      service.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('update', () => {
    it('should call update', async () => {
      const updateDto = {
        id: 1,
        title: 'Title Update',
        author: 'Author Update',
        genre: 'Genre Update',
        published_year: 2025,
        created_at: new Date(),
        updated_at: new Date(),
      } as UpdateBookDto

      const mockResponse = responseException('Book updated successfully');

      service.update.mockResolvedValue(mockResponse);

      const result = await controller.update('1', updateDto);

      expect(service.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('remove', () => {
    it('should call remove', async () => {
      const mockResponse = responseException('Book #1 has been deleted');
      service.remove.mockResolvedValue(mockResponse);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockResponse);
    });
  });
});
