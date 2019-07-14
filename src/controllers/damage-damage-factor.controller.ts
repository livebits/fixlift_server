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
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Damage,
  DamageFactor,
} from '../models';
import {DamageRepository} from '../repositories';

export class DamageDamageFactorController {
  constructor(
    @repository(DamageRepository) protected damageRepository: DamageRepository,
  ) { }

  @get('/damages/{id}/damage-factors', {
    responses: {
      '200': {
        description: 'Array of DamageFactor\'s belonging to Damage',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': DamageFactor } },
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<DamageFactor>,
  ): Promise<DamageFactor[]> {
    return await this.damageRepository.damageFactors(id).find(filter);
  }

  @post('/damages/{id}/damage-factors', {
    responses: {
      '200': {
        description: 'Damage model instance',
        content: { 'application/json': { schema: { 'x-ts-type': DamageFactor } } },
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Damage.prototype.id,
    @requestBody() damageFactor: DamageFactor,
  ): Promise<DamageFactor> {
    return await this.damageRepository.damageFactors(id).create(damageFactor);
  }

  @patch('/damages/{id}/damage-factors', {
    responses: {
      '200': {
        description: 'Damage.DamageFactor PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DamageFactor, {partial: true}),
        },
      },
    })
    damageFactor: Partial<DamageFactor>,
    @param.query.object('where', getWhereSchemaFor(DamageFactor)) where?: Where<DamageFactor>,
  ): Promise<Count> {
    return await this.damageRepository.damageFactors(id).patch(damageFactor, where);
  }

  @del('/damages/{id}/damage-factors', {
    responses: {
      '200': {
        description: 'Damage.DamageFactor DELETE success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(DamageFactor)) where?: Where<DamageFactor>,
  ): Promise<Count> {
    return await this.damageRepository.damageFactors(id).delete(where);
  }
}
