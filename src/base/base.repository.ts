import { DeleteResult, FindManyOptions, InsertResult, ObjectLiteral, Repository, UpdateResult } from "typeorm";

export class BaseRepository<T extends ObjectLiteral> {
    constructor(
        private model: Repository<T>
    ) { }

    async insert(payload: T): Promise<InsertResult> {
        return await this.model.insert(payload);
    }

    async update(id: number, payload: T): Promise<UpdateResult> {
        return await this.model.update(id, payload);
    }

    async delete(id: number): Promise<DeleteResult> {
        return await this.model.delete(id);
    }

    async findAndCount(options: FindManyOptions<T>): Promise<[T[], number]> {
        return await this.model.findAndCount(options);
    }
}