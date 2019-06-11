import {DefaultCrudRepository} from '@loopback/repository';
import {ServiceUserMessage, ServiceUserMessageRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ServiceUserMessageRepository extends DefaultCrudRepository<
  ServiceUserMessage,
  typeof ServiceUserMessage.prototype.id,
  ServiceUserMessageRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(ServiceUserMessage, dataSource);
  }
}
