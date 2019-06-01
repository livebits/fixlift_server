import { Model, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'service_user_messages' })
export class ServiceUserMessage extends BaseEntity {
  @property({
    type: 'number',
    name: 'service_user_id'
  })
  serviceUserId?: number;

  @property({
    type: 'number',
    name: 'message_id'
  })
  messageId?: number;


  constructor(data?: Partial<ServiceUserMessage>) {
    super(data);
  }
}
