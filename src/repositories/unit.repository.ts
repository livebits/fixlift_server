import {DefaultCrudRepository} from '@loopback/repository';
import {Unit, UnitRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class UnitRepository extends DefaultCrudRepository<
  Unit,
  typeof Unit.prototype.id,
  UnitRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Unit, dataSource);
  }
}
