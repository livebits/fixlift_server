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
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import { Unit } from '../models';
import { UnitRepository } from '../repositories';
import { inject } from '@loopback/core';
import { AuthenticationBindings, UserProfile, authenticate } from '@loopback/authentication';

export class UnitController {
  constructor(
    @repository(UnitRepository)
    public unitRepository: UnitRepository,
  ) { }

  @authenticate('jwt')
  @post('/units', {
    responses: {
      '200': {
        description: 'Unit model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Unit } } },
      },
    },
  })
  async create(
    @requestBody() unit: Unit,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<Unit> {
    unit.companyUserId = Number(currentUser.id);
    return await this.unitRepository.create(unit);
  }

  @get('/units/count', {
    responses: {
      '200': {
        description: 'Unit model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Unit)) where?: Where<Unit>,
  ): Promise<Count> {
    return await this.unitRepository.count(where);
  }

  @get('/units', {
    responses: {
      '200': {
        description: 'Array of Unit model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Unit } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Unit)) filter?: Filter<Unit>,
  ): Promise<Unit[]> {
    return await this.unitRepository.find(filter);
  }

  @patch('/units', {
    responses: {
      '200': {
        description: 'Unit PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody() unit: Unit,
    @param.query.object('where', getWhereSchemaFor(Unit)) where?: Where<Unit>,
  ): Promise<Count> {
    return await this.unitRepository.updateAll(unit, where);
  }

  @get('/units/{id}', {
    responses: {
      '200': {
        description: 'Unit model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Unit } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Unit> {
    return await this.unitRepository.findById(id);
  }

  @patch('/units/{id}', {
    responses: {
      '204': {
        description: 'Unit PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() unit: Unit,
  ): Promise<void> {
    await this.unitRepository.updateById(id, unit);
  }

  @put('/units/{id}', {
    responses: {
      '204': {
        description: 'Unit PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() unit: Unit,
  ): Promise<void> {
    await this.unitRepository.replaceById(id, unit);
  }

  @del('/units/{id}', {
    responses: {
      '204': {
        description: 'Unit DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.unitRepository.deleteById(id);
  }
}
