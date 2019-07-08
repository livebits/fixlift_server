import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import { Damage, DamageFilter } from '../models';
import { DamageRepository } from '../repositories';
import { authenticate, AuthenticationBindings, UserProfile } from '@loopback/authentication';
import { inject } from '@loopback/core';

export class DamagesController {
  constructor(
    @repository(DamageRepository)
    public damageRepository: DamageRepository,
  ) { }

  @authenticate('jwt')
  @post('/damages', {
    responses: {
      '200': {
        description: 'Damage model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Damage } } },
      },
    },
  })
  async create(
    @requestBody() damage: Damage,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<Damage> {

    damage.createdBy = "operator";
    damage.creatorId = Number(currentUser.id);
    return await this.damageRepository.create(damage);
  }

  @get('/damages/count', {
    responses: {
      '200': {
        description: 'Damage model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Damage)) where?: Where<Damage>,
  ): Promise<Count> {
    return await this.damageRepository.count(where);
  }

  @get('/damages', {
    responses: {
      '200': {
        description: 'Array of Damage model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Damage } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Damage)) filter?: Filter<Damage>,
  ): Promise<Damage[]> {
    return await this.damageRepository.find(filter);
  }

  @patch('/damages', {
    responses: {
      '200': {
        description: 'Damage PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Damage, { partial: true }),
        },
      },
    })
    damage: Damage,
    @param.query.object('where', getWhereSchemaFor(Damage)) where?: Where<Damage>,
  ): Promise<Count> {
    return await this.damageRepository.updateAll(damage, where);
  }

  @get('/damages/{id}', {
    responses: {
      '200': {
        description: 'Damage model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Damage } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Damage> {
    return await this.damageRepository.findById(id);
  }

  @patch('/damages/{id}', {
    responses: {
      '204': {
        description: 'Damage PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Damage, { partial: true }),
        },
      },
    })
    damage: Damage,
  ): Promise<void> {
    await this.damageRepository.updateById(id, damage);
  }

  @put('/damages/{id}', {
    responses: {
      '204': {
        description: 'Damage PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() damage: Damage,
  ): Promise<void> {
    await this.damageRepository.replaceById(id, damage);
  }

  @del('/damages/{id}', {
    responses: {
      '204': {
        description: 'Damage DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.damageRepository.deleteById(id);
  }

  @post('/damages/filter', {
    responses: {
      '200': {
        description: 'Damage model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Damage } } },
      },
    },
  })
  async filter(@requestBody() damageFilter: DamageFilter): Promise<any> {

    // return await this.serviceRepository.create(service);

    const sql = `SELECT dmg.*, d.*, l.*
      FROM damages dmg
      LEFT JOIN deal d ON d.id = dmg.deal_id
      LEFT JOIN lifts l ON d.id = l.deal_id
      WHERE dmg.status = ${damageFilter.status} AND d.contract_number = ${damageFilter.dealContractNumber}
      order by dmg.id desc`;

    return await this.damageRepository.query(sql);
  }
}
