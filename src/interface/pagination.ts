import { Type } from "class-transformer";

export class Pagination {
    @Type(() => Number)
    page: number;

    @Type(() => Number)
    pageSize: number;

    get skip(): number {
        return (this.page - 1) * this.pageSize;
    }
}
