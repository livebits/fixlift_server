import {DefaultCrudRepository} from '@loopback/repository';
import {DealPayment, DealPaymentRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class DealPaymentRepository extends DefaultCrudRepository<
  DealPayment,
  typeof DealPayment.prototype.id,
  DealPaymentRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(DealPayment, dataSource);
  }
}
