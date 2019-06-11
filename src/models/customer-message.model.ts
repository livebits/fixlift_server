import { Model, belongsTo, model, property, Entity } from '@loopback/repository';
import { Customer } from './customer.model';
import { Message } from './message.model';

@model({ name: 'customer_messages' })
export class CustomerMessage extends Entity {

  @property({
    type: 'number',
    id: true,
    generated: true
  })
  id?: number;

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
    () => Message,
    { keyFrom: 'message_id', name: 'message' },
    {
      type: 'number',
      index: true,
      name: 'message_id',
      mysql: {
        columnName: 'message_id',
      },
    },
  )
  messageId?: number;


  constructor(data?: Partial<CustomerMessage>) {
    super(data);
  }
}

export interface CustomerMessageRelations {

}

export type CustomerMessageWithRelations = CustomerMessage & CustomerMessageRelations;
