import { Model, model, Entity, property } from '@loopback/repository';

@model({ name: 'service_user_messages' })
export class ServiceUserMessage extends Entity {

  @property({
    type: 'number',
    id: true,
    mysql: {
      columnName: 'service_user_id',
    },
  })
  serviceUserId?: number;

  @property({
    type: 'number',
    id: true,
    mysql: {
      columnName: 'message_id',
    },
  })
  messageId?: number;


  constructor(data?: Partial<ServiceUserMessage>) {
    super(data);
  }
}
