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
import { Emergency } from '../models';
import { EmergencyRepository } from '../repositories';

export class EmergenciesController {
  constructor(
    @repository(EmergencyRepository)
    public emergencyRepository: EmergencyRepository,
  ) { }

  @post('/emergencies', {
    responses: {
      '200': {
        description: 'Emergency model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Emergency } } },
      },
    },
  })
  async create(@requestBody() emergency: Emergency): Promise<Emergency> {
    return await this.emergencyRepository.create(emergency);
  }

  @get('/emergencies/count', {
    responses: {
      '200': {
        description: 'Emergency model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Emergency)) where?: Where<Emergency>,
  ): Promise<Count> {
    return await this.emergencyRepository.count(where);
  }

  @get('/emergencies', {
    responses: {
      '200': {
        description: 'Array of Emergency model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Emergency } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Emergency)) filter?: Filter<Emergency>,
  ): Promise<Emergency[]> {
    return await this.emergencyRepository.find(filter);
  }

  @patch('/emergencies', {
    responses: {
      '200': {
        description: 'Emergency PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Emergency, { partial: true }),
        },
      },
    })
    emergency: Emergency,
    @param.query.object('where', getWhereSchemaFor(Emergency)) where?: Where<Emergency>,
  ): Promise<Count> {
    return await this.emergencyRepository.updateAll(emergency, where);
  }

  @get('/emergencies/{id}', {
    responses: {
      '200': {
        description: 'Emergency model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Emergency } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Emergency> {
    return await this.emergencyRepository.findById(id);
  }

  @patch('/emergencies/{id}', {
    responses: {
      '204': {
        description: 'Emergency PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Emergency, { partial: true }),
        },
      },
    })
    emergency: Emergency,
  ): Promise<void> {
    await this.emergencyRepository.updateById(id, emergency);
  }

  @put('/emergencies/{id}', {
    responses: {
      '204': {
        description: 'Emergency PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() emergency: Emergency,
  ): Promise<void> {
    await this.emergencyRepository.replaceById(id, emergency);
  }

  @del('/emergencies/{id}', {
    responses: {
      '204': {
        description: 'Emergency DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.emergencyRepository.deleteById(id);
  }
}
