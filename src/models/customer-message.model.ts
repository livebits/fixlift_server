import { Model, model, property } from '@loopback/repository';

@model({ name: 'customer_messages' })
export class CustomerMessage extends Model {
  @property({
    type: 'number',
    name: 'customer_id'
  })
  customerId?: number;

  @property({
    type: 'number',
    name: 'message_id'
  })
  messageId?: number;


  constructor(data?: Partial<CustomerMessage>) {
    super(data);
  }
}
