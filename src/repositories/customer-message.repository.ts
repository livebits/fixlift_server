import {DefaultCrudRepository} from '@loopback/repository';
import {CustomerMessage, CustomerMessageRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class CustomerMessageRepository extends DefaultCrudRepository<
  CustomerMessage,
  typeof CustomerMessage.prototype.id,
  CustomerMessageRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(CustomerMessage, dataSource);
  }
}
