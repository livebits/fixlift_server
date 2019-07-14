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
  DamageSegment,
} from '../models';
import {DamageRepository} from '../repositories';

export class DamageDamageSegmentController {
  constructor(
    @repository(DamageRepository) protected damageRepository: DamageRepository,
  ) { }

  @get('/damages/{id}/damage-segments', {
    responses: {
      '200': {
        description: 'Array of DamageSegment\'s belonging to Damage',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': DamageSegment } },
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<DamageSegment>,
  ): Promise<DamageSegment[]> {
    return await this.damageRepository.damageSegments(id).find(filter);
  }

  @post('/damages/{id}/damage-segments', {
    responses: {
      '200': {
        description: 'Damage model instance',
        content: { 'application/json': { schema: { 'x-ts-type': DamageSegment } } },
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Damage.prototype.id,
    @requestBody() damageSegment: DamageSegment,
  ): Promise<DamageSegment> {
    return await this.damageRepository.damageSegments(id).create(damageSegment);
  }

  @patch('/damages/{id}/damage-segments', {
    responses: {
      '200': {
        description: 'Damage.DamageSegment PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DamageSegment, {partial: true}),
        },
      },
    })
    damageSegment: Partial<DamageSegment>,
    @param.query.object('where', getWhereSchemaFor(DamageSegment)) where?: Where<DamageSegment>,
  ): Promise<Count> {
    return await this.damageRepository.damageSegments(id).patch(damageSegment, where);
  }

  @del('/damages/{id}/damage-segments', {
    responses: {
      '200': {
        description: 'Damage.DamageSegment DELETE success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(DamageSegment)) where?: Where<DamageSegment>,
  ): Promise<Count> {
    return await this.damageRepository.damageSegments(id).delete(where);
  }
}
