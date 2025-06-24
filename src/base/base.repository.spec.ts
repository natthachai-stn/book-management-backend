import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { BaseRepository } from './base.repository';
import { Book } from '../book/entity/book.entity';

describe('BaseRepository', () => {
    let baseRepository: BaseRepository<any>;
    let mockRepository: jest.Mocked<Repository<any>>;

    beforeEach(() => {
        mockRepository = {
            insert: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findAndCount: jest.fn(),
        } as unknown as jest.Mocked<Repository<any>>;

        baseRepository = new BaseRepository(mockRepository);
    });

    describe('insert', () => {
        it('should insert a document', async () => {
            const payload = {
                title: 'Test Title',
                id: 10,
                author: 'David',
                published_year: 2015,
                genre: 'MockGenre'
            }
            const insertResult: InsertResult = {
                identifiers: [{ id: 1 }],
                generatedMaps: [],
                raw: []
            }
            mockRepository.insert.mockResolvedValue(insertResult);

            const result = await baseRepository.insert(payload);

            expect(mockRepository.insert).toHaveBeenCalledWith(payload);
            expect(result).toBe(insertResult);
        });
    });

    describe('update', () => {
        it('should update a document', async () => {
            const id = 100;
            const payload = {
                title: 'Test Title',
                id: 10,
                author: 'David',
                published_year: 2015,
                genre: 'MockGenre'
            }
            const updateResult: UpdateResult = {
                affected: 1,
                raw: [],
                generatedMaps: []
            }

            mockRepository.update.mockResolvedValue(updateResult);

            const result = await baseRepository.update(id, payload);

            expect(mockRepository.update).toHaveBeenCalledWith(id, payload);
            expect(result).toBe(updateResult);
        });
    });

    describe('delete', () => {
        it('should delete a document', async () => {
            const id = 1;
            const deleteResult: DeleteResult = {
                affected: 1,
                raw: []
            }

            mockRepository.delete.mockResolvedValue(deleteResult);

            const result = await baseRepository.delete(id);

            expect(mockRepository.delete).toHaveBeenCalledWith(id);
            expect(result).toBe(deleteResult);
        });
    });

    describe('findAndCount', () => {
        it('should findAndCount document and return values', async () => {
            const options = {
                skip: 1,
                take: 10,
                order: { id: 'asc' },
            }
            const dataMocks: Book[] = [
                {
                    title: 'Mock1',
                    id: 1,
                    author: 'David1',
                    published_year: 2015,
                    genre: 'MockGenre',
                    created_at: new Date(),
                    updated_at: new Date()
                },
                {
                    title: 'Mock2',
                    id: 2,
                    author: 'David2',
                    published_year: 2010,
                    genre: 'MockGenre',
                    created_at: new Date(),
                    updated_at: new Date()
                },
            ]
            const findResult: [any[], number] = [dataMocks, 1];

            mockRepository.findAndCount.mockResolvedValue(findResult);

            const result = await baseRepository.findAndCount(options);

            expect(mockRepository.findAndCount).toHaveBeenCalledWith(options);
            expect(result).toEqual(findResult);
        });
    });
});
