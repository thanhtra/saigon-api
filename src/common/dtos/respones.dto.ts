import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { Order } from "../helpers/constants";


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

export class PageOptionsDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    keySearch: string = '';

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    multipleSearchEnums: string = '';

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    active: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    isPagin: string = 'true';

    @ApiPropertyOptional({ enum: Order, default: Order.ASC })
    @IsEnum(Order)
    @IsOptional()
    order: Order = Order.DESC;

    @ApiPropertyOptional({
        minimum: 1,
        default: 1,
    })
    @Type(() => Number)
    @IsInt()
    @Min(0)
    @IsOptional()
    page: number = 0;

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
        return (this.page) * this.size;
    }
}

export class DataRes<T> {
    message: string;
    success: boolean;
    data: T;

    public setSuccess(data: T) {
        this.success = true;
        this.data = data;
        this.message = "Successfully"
    }

    public setFailed(error: string) {
        this.success = false;
        this.data = null;
        this.message = error;
    }
}
