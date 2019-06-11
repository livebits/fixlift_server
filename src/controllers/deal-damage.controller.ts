import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Deal,
  Damage,
} from '../models';
import {DealRepository} from '../repositories';

export class DealDamageController {
  constructor(
    @repository(DealRepository) protected dealRepository: DealRepository,
  ) { }

  @get('/deals/{id}/damages', {
    responses: {
      '200': {
        description: 'Array of Damage\'s belonging to Deal',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Damage } },
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Damage>,
  ): Promise<Damage[]> {
    return await this.dealRepository.damages(id).find(filter);
  }

  @post('/deals/{id}/damages', {
    responses: {
      '200': {
        description: 'Deal model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Damage } } },
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Deal.prototype.id,
    @requestBody() damage: Damage,
  ): Promise<Damage> {
    return await this.dealRepository.damages(id).create(damage);
  }

  @patch('/deals/{id}/damages', {
    responses: {
      '200': {
        description: 'Deal.Damage PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody() damage: Partial<Damage>,
    @param.query.object('where', getWhereSchemaFor(Damage)) where?: Where<Damage>,
  ): Promise<Count> {
    return await this.dealRepository.damages(id).patch(damage, where);
  }

  @del('/deals/{id}/damages', {
    responses: {
      '200': {
        description: 'Deal.Damage DELETE success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Damage)) where?: Where<Damage>,
  ): Promise<Count> {
    return await this.dealRepository.damages(id).delete(where);
  }
}
