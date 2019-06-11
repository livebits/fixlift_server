import {DefaultCrudRepository} from '@loopback/repository';
import {Insurance, InsuranceRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class InsuranceRepository extends DefaultCrudRepository<
  Insurance,
  typeof Insurance.prototype.id,
  InsuranceRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Insurance, dataSource);
  }
}
