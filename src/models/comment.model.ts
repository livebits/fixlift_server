import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'comments' })
export class Comment extends BaseEntity {

  @property({
    type: 'string',
  })
  comment?: string;

  @property({
    type: 'number',
  })
  rate?: number;

  @property({
    type: 'string',
  })
  status?: string;


  constructor(data?: Partial<Comment>) {
    super(data);
  }
}
