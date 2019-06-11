import {DefaultCrudRepository} from '@loopback/repository';
import {DamageFactor, DamageFactorRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class DamageFactorRepository extends DefaultCrudRepository<
  DamageFactor,
  typeof DamageFactor.prototype.id,
  DamageFactorRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(DamageFactor, dataSource);
  }
}
