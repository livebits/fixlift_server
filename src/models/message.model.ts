import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'messages' })
export class Message extends Entity {

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

export interface MessageRelations {

}

export type MessageWithRelations = Message & MessageRelations;
