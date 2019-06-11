import {DefaultCrudRepository} from '@loopback/repository';
import {DamageFactorPayment, DamageFactorPaymentRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class DamageFactorPaymentRepository extends DefaultCrudRepository<
  DamageFactorPayment,
  typeof DamageFactorPayment.prototype.id,
  DamageFactorPaymentRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(DamageFactorPayment, dataSource);
  }
}
