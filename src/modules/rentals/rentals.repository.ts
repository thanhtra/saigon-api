import { Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { Rental } from './entities/rental.entity';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/common/dtos/respones.dto';
import { getSkip, slugify } from 'src/common/helpers/utils';

@Injectable()
export class RentalsRepository {
    private repo: Repository<Rental>;

    constructor(private connection: Connection) {
        this.repo = this.connection.getRepository(Rental);
    }

    async create(dto: CreateRentalDto): Promise<Rental> {
        const slug = slugify(dto.title.trim()) + '-' + Math.floor(Math.random() * 1000);
        const rental = this.repo.create({ ...dto, slug });
        return this.repo.save(rental);
    }

    async update(id: string, dto: UpdateRentalDto): Promise<Rental | null> {
        const rental = await this.repo.preload({ id, ...dto });
        if (!rental) return null;
        return this.repo.save(rental);
    }

    async remove(id: string): Promise<boolean> {
        const { affected } = await this.repo.delete(id);
        return affected === 1;
    }

    async findOne(id: string): Promise<Rental | null> {
        return this.repo.findOne({ where: { id }, relations: ['amenities', 'uploads'] });
    }

    async findAll(pageOptions: PageOptionsDto): Promise<PageDto<Rental>> {
        const qb = this.repo.createQueryBuilder('rental')
            .orderBy('rental.createdAt', pageOptions.order)
            .skip(getSkip(pageOptions.page, pageOptions.size))
            .take(Math.min(pageOptions.size, 50));

        if (pageOptions.keySearch) {
            qb.andWhere('rental.title LIKE :q OR rental.address_detail LIKE :q', { q: `%${pageOptions.keySearch}%` });
        }

        const [entities, itemCount] = await qb.getManyAndCount();
        return new PageDto(entities, new PageMetaDto({ itemCount, pageOptionsDto: pageOptions }));
    }
}
