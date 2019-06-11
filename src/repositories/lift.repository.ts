import {DefaultCrudRepository} from '@loopback/repository';
import {Lift, LiftRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class LiftRepository extends DefaultCrudRepository<
  Lift,
  typeof Lift.prototype.id,
  LiftRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Lift, dataSource);
  }
}
