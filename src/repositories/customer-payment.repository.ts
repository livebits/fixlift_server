import {DefaultCrudRepository} from '@loopback/repository';
import {CustomerPayment, CustomerPaymentRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class CustomerPaymentRepository extends DefaultCrudRepository<
  CustomerPayment,
  typeof CustomerPayment.prototype.id,
  CustomerPaymentRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(CustomerPayment, dataSource);
  }
}
