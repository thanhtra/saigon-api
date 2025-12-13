import { Module } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';
import { AddressesRepository } from './addresses.repository';
import { UsersRepository } from '../users/users.repository';

@Module({
  controllers: [AddressesController],
  exports: [AddressesService],
  providers: [AddressesService, AddressesRepository, UsersRepository]
})
export class AddressesModule { }