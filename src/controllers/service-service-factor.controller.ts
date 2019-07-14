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
  Service,
  ServiceFactor,
} from '../models';
import {ServiceRepository} from '../repositories';

export class ServiceServiceFactorController {
  constructor(
    @repository(ServiceRepository) protected serviceRepository: ServiceRepository,
  ) { }

  @get('/services/{id}/service-factors', {
    responses: {
      '200': {
        description: 'Array of ServiceFactor\'s belonging to Service',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': ServiceFactor } },
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<ServiceFactor>,
  ): Promise<ServiceFactor[]> {
    return await this.serviceRepository.serviceFactors(id).find(filter);
  }

  @post('/services/{id}/service-factors', {
    responses: {
      '200': {
        description: 'Service model instance',
        content: { 'application/json': { schema: { 'x-ts-type': ServiceFactor } } },
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Service.prototype.id,
    @requestBody() serviceFactor: ServiceFactor,
  ): Promise<ServiceFactor> {
    return await this.serviceRepository.serviceFactors(id).create(serviceFactor);
  }

  @patch('/services/{id}/service-factors', {
    responses: {
      '200': {
        description: 'Service.ServiceFactor PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ServiceFactor, {partial: true}),
        },
      },
    })
    serviceFactor: Partial<ServiceFactor>,
    @param.query.object('where', getWhereSchemaFor(ServiceFactor)) where?: Where<ServiceFactor>,
  ): Promise<Count> {
    return await this.serviceRepository.serviceFactors(id).patch(serviceFactor, where);
  }

  @del('/services/{id}/service-factors', {
    responses: {
      '200': {
        description: 'Service.ServiceFactor DELETE success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(ServiceFactor)) where?: Where<ServiceFactor>,
  ): Promise<Count> {
    return await this.serviceRepository.serviceFactors(id).delete(where);
  }
}
