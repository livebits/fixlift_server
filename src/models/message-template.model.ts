import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'message_templates' })
export class MessageTemplate extends Entity {

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
  title: string;

  @property({
    type: 'number',
  })
  reminder?: number;

  @property({
    type: 'string',
  })
  reminderTimeType?: string;

  @property({
    type: 'string',
    mysql: {
      columnName: 'property_model',
    },
  })
  propertyModel?: string;

  @property({
    type: 'string',
    mysql: {
      columnName: 'property_name',
    },
  })
  propertyName?: string;

  @property({
    type: 'string',
    mysql: {
      columnName: 'property_title',
    },
  })
  propertyTitle?: string;

  @property({
    type: 'string',
  })
  body?: string;

  @property({
    type: 'boolean',
  })
  status?: boolean;

  constructor(data?: Partial<MessageTemplate>) {
    super(data);
  }
}

export interface MessageTemplateRelations {

}

export type MessageTemplateWithRelations = MessageTemplate & MessageTemplateRelations;
