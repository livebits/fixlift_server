import {DefaultCrudRepository} from '@loopback/repository';
import {LiftFieldValue, LiftFieldValueRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class LiftFieldValueRepository extends DefaultCrudRepository<
  LiftFieldValue,
  typeof LiftFieldValue.prototype.id,
  LiftFieldValueRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(LiftFieldValue, dataSource);
  }
}
