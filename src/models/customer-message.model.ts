import { Model, model, property, Entity } from '@loopback/repository';

@model({ name: 'customer_messages' })
export class CustomerMessage extends Entity {
  @property({
    type: 'number',
    mysql: {
      columnName: 'customer_id',
    },
    id: true
  })
  customerId?: number;

  @property({
    type: 'number',
    name: 'message_id',
    mysql: {
      columnName: 'message_id',
    },
    id: true
  })
  messageId?: number;


  constructor(data?: Partial<CustomerMessage>) {
    super(data);
  }
}
