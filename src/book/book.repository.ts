import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "../base/base.repository";
import { Book } from "./entity/book.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class BookRepository extends BaseRepository<Book> {
    constructor(
        @InjectRepository(Book)
        readonly categoryModel: Repository<Book>
    ) {
        super(categoryModel);
    }
}