import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'service_comments' })
export class ServiceComment extends Entity {

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
    type: 'number',
    mysql: {
      columnName: 'service_id',
    },
  })
  serviceId?: number;

  @property({
    type: 'number',
    mysql: {
      columnName: 'comment_id',
    },
  })
  commentId?: number;


  constructor(data?: Partial<ServiceComment>) {
    super(data);
  }
}
