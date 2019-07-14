import { Model, model, Entity, property, belongsTo } from '@loopback/repository';
import { Message } from './message.model';
import { ServiceUser } from './service-user.model';

@model({ name: 'service_user_messages' })
export class ServiceUserMessage extends Entity {

  @property({
    type: 'number',
    id: true,
    generated: true
  })
  id?: number;

  @belongsTo(
    () => ServiceUser,
    { keyFrom: 'serviceUserId', name: 'serviceUser' },
    {
      type: 'number',
      index: true,
      name: 'service_user_id',
      mysql: {
        columnName: 'service_user_id',
      },
    },
  )
  serviceUserId?: number;

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


  constructor(data?: Partial<ServiceUserMessage>) {
    super(data);
  }
}

export interface ServiceUserMessageRelations {

}

export type ServiceUserMessageWithRelations = ServiceUserMessage & ServiceUserMessageRelations;
