import {DefaultCrudRepository} from '@loopback/repository';
import {Payment, PaymentRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class PaymentRepository extends DefaultCrudRepository<
  Payment,
  typeof Payment.prototype.id,
  PaymentRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Payment, dataSource);
  }
}
