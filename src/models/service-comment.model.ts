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

export interface ServiceCommentRelations {

}

export type ServiceCommentWithRelations = ServiceComment & ServiceCommentRelations;
