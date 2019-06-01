import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'messages' })
export class Message extends BaseEntity {

  @property({
    type: 'string',
  })
  title?: string;

  @property({
    type: 'string',
  })
  body?: string;

  @property({
    type: 'string',
  })
  type?: string;

  @property({
    type: 'boolean',
  })
  status?: boolean;


  constructor(data?: Partial<Message>) {
    super(data);
  }
}
