import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { Order } from "../helpers/enum";



interface PageMetaDtoParameters {
    pageOptionsDto: PageOptionsDto;
    itemCount: number;
}

export class PageMetaDto {
    @ApiProperty()
    page: number;

    @ApiProperty()
    size: number;

    @ApiProperty()
    itemCount: number;

    @ApiProperty()
    pageCount: number;

    @ApiProperty()
    hasPreviousPage: boolean;

    @ApiProperty()
    hasNextPage: boolean;

    constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters) {
        this.page = pageOptionsDto.page;
        this.size = pageOptionsDto.size;
        this.itemCount = itemCount;
        this.pageCount = Math.ceil(this.itemCount / this.size);
        this.hasPreviousPage = this.page > 1;
        this.hasNextPage = this.page < this.pageCount;
    }
}

export class PageDto<T> {
    @IsArray()
    @ApiProperty({ isArray: true })
    data: T[];

    @ApiProperty({ type: () => PageMetaDto })
    meta: PageMetaDto;

    constructor(data: T[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}

import { Transform } from 'class-transformer';
import {
    IsBoolean
} from 'class-validator';

export class PageOptionsDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    key_search?: string;

    @ApiPropertyOptional({ example: true })
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    @IsOptional()
    active?: boolean;

    @ApiPropertyOptional({ default: true })
    @Transform(({ value }) => value !== 'false')
    @IsBoolean()
    @IsOptional()
    is_pagin: boolean = true;

    @ApiPropertyOptional({ enum: Order, default: Order.DESC })
    @IsEnum(Order)
    @IsOptional()
    order: Order = Order.DESC;

    @ApiPropertyOptional({
        minimum: 1,
        default: 1,
        description: 'Page index starts from 1',
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    page: number = 1;

    @ApiPropertyOptional({
        minimum: 1,
        maximum: 50,
        default: 10,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    @IsOptional()
    size: number = 10;

    get skip(): number {
        return (this.page - 1) * this.size;
    }
}

export class DataRes<T> {
    success: boolean;
    message: string;
    data: T | null;

    static success<T>(data: T, message = 'Successfully'): DataRes<T> {
        const res = new DataRes<T>();
        res.success = true;
        res.data = data;
        res.message = message;
        return res;
    }

    static failed<T>(message: string): DataRes<T> {
        const res = new DataRes<T>();
        res.success = false;
        res.data = null;
        res.message = message;
        return res;
    }
}
