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
  DamageChecklist,
} from '../models';
import {DamageRepository} from '../repositories';

export class DamageDamageChecklistController {
  constructor(
    @repository(DamageRepository) protected damageRepository: DamageRepository,
  ) { }

  @get('/damages/{id}/damage-checklists', {
    responses: {
      '200': {
        description: 'Array of DamageChecklist\'s belonging to Damage',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': DamageChecklist } },
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<DamageChecklist>,
  ): Promise<DamageChecklist[]> {
    return await this.damageRepository.damageChecklists(id).find(filter);
  }

  @post('/damages/{id}/damage-checklists', {
    responses: {
      '200': {
        description: 'Damage model instance',
        content: { 'application/json': { schema: { 'x-ts-type': DamageChecklist } } },
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Damage.prototype.id,
    @requestBody() damageChecklist: DamageChecklist,
  ): Promise<DamageChecklist> {
    return await this.damageRepository.damageChecklists(id).create(damageChecklist);
  }

  @patch('/damages/{id}/damage-checklists', {
    responses: {
      '200': {
        description: 'Damage.DamageChecklist PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DamageChecklist, {partial: true}),
        },
      },
    })
    damageChecklist: Partial<DamageChecklist>,
    @param.query.object('where', getWhereSchemaFor(DamageChecklist)) where?: Where<DamageChecklist>,
  ): Promise<Count> {
    return await this.damageRepository.damageChecklists(id).patch(damageChecklist, where);
  }

  @del('/damages/{id}/damage-checklists', {
    responses: {
      '200': {
        description: 'Damage.DamageChecklist DELETE success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(DamageChecklist)) where?: Where<DamageChecklist>,
  ): Promise<Count> {
    return await this.damageRepository.damageChecklists(id).delete(where);
  }
}
