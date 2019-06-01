import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'service_comments' })
export class ServiceComment extends BaseEntity {

  @property({
    type: 'number',
    name: 'service_id'
  })
  serviceId?: number;

  @property({
    type: 'number',
    name: 'comment_id'
  })
  commentId?: number;


  constructor(data?: Partial<ServiceComment>) {
    super(data);
  }
}
