import { Model, belongsTo, model, property, Entity } from '@loopback/repository';
import { Customer } from './customer.model';
import { Message } from './message.model';
import { Payment } from './payment.model';

@model({ name: 'customer_payments' })
export class CustomerPayment extends Entity {

  @property({
    type: 'number',
    id: true,
    generated: true
  })
  id?: number;

  @property({
    type: 'date',
    default: () => new Date(),
    mysql: {
      columnName: 'created_on',
    },
  })
  createdOn?: Date;

  @property({
    type: 'date',
    default: () => new Date(),
    mysql: {
      columnName: 'modified_on',
    },
  })
  modifiedOn?: Date;

  @belongsTo(
    () => Customer,
    { keyFrom: 'customer_id', name: 'customer' },
    {
      type: 'number',
      index: true,
      name: 'customer_id',
      mysql: {
        columnName: 'customer_id',
      },
    },
  )
  customerId?: number;

  @belongsTo(
    () => Payment,
    { keyFrom: 'payment_id', name: 'payment' },
    {
      type: 'number',
      index: true,
      name: 'payment_id',
      mysql: {
        columnName: 'payment_id',
      },
    },
  )
  paymentId?: number;

  @property({
    type: 'string',
  })
  for?: string;

  @property({
    type: 'string',
    mysql: {
      columnName: 'model_name',
    },
  })
  modelName?: string;

  @property({
    type: 'number',
    mysql: {
      columnName: 'model_id',
    },
  })
  modelId?: number;

  @property({
    type: 'string',
    mysql: {
      columnName: 'add_by_role',
    },
  })
  addByRole?: string;

  @property({
    type: 'number',
    mysql: {
      columnName: 'add_by_id',
    },
  })
  addById?: number;

  @property({
    type: 'number',
    mysql: {
      columnName: 'company_user_id',
    },
  })
  companyUserId: number;


  constructor(data?: Partial<CustomerPayment>) {
    super(data);
  }
}

export interface CustomerPaymentRelations {

}

export type CustomerPaymentWithRelations = CustomerPayment & CustomerPaymentRelations;

export class WorkPayment {

  @property({
    type: 'number',
  })
  amount?: number;

  @property({
    type: 'string',
  })
  paymentType?: string;

  @property({
    type: 'string',
  })
  paymentDate?: string;

  @property({
    type: 'string',
  })
  paymentFor?: string;

  @property({
    type: 'number',
  })
  customerId?: number;

  @property({
    type: 'string',
  })
  addByRole?: string;

  @property({
    type: 'number',
  })
  addById?: number;
}
