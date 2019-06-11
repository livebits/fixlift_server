import {DefaultCrudRepository} from '@loopback/repository';
import {ServiceFactorPayment, ServiceFactorPaymentRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ServiceFactorPaymentRepository extends DefaultCrudRepository<
  ServiceFactorPayment,
  typeof ServiceFactorPayment.prototype.id,
  ServiceFactorPaymentRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(ServiceFactorPayment, dataSource);
  }
}
