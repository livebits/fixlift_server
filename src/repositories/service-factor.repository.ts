import {DefaultCrudRepository} from '@loopback/repository';
import {ServiceFactor, ServiceFactorRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ServiceFactorRepository extends DefaultCrudRepository<
  ServiceFactor,
  typeof ServiceFactor.prototype.id,
  ServiceFactorRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(ServiceFactor, dataSource);
  }
}
