import {DefaultCrudRepository} from '@loopback/repository';
import {LiftField, LiftFieldRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class LiftFieldRepository extends DefaultCrudRepository<
  LiftField,
  typeof LiftField.prototype.id,
  LiftFieldRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(LiftField, dataSource);
  }
}
