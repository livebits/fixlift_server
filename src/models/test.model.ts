import {Entity, model, property} from '@loopback/repository';

@model({settings: {}})
export class Test extends Entity {
  @property({
    type: 'geopoint',
  })
  id?: string;


  constructor(data?: Partial<Test>) {
    super(data);
  }
}

export interface TestRelations {
  // describe navigational properties here
}

export type TestWithRelations = Test & TestRelations;
