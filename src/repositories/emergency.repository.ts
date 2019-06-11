import {DefaultCrudRepository} from '@loopback/repository';
import {Emergency, EmergencyRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class EmergencyRepository extends DefaultCrudRepository<
  Emergency,
  typeof Emergency.prototype.id,
  EmergencyRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Emergency, dataSource);
  }
}
