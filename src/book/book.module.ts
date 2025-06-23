import { forwardRef, Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entity/book.entity';
import { BookRepository } from './book.repository';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book]),
    forwardRef(() => JwtModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [BookController],
  providers: [BookService, BookRepository],
})
export class BookModule { }
