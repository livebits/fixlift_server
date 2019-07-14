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
  ServiceSegment,
} from '../models';
import {ServiceRepository} from '../repositories';

export class ServiceServiceSegmentController {
  constructor(
    @repository(ServiceRepository) protected serviceRepository: ServiceRepository,
  ) { }

  @get('/services/{id}/service-segments', {
    responses: {
      '200': {
        description: 'Array of ServiceSegment\'s belonging to Service',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': ServiceSegment } },
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<ServiceSegment>,
  ): Promise<ServiceSegment[]> {
    return await this.serviceRepository.serviceSegments(id).find(filter);
  }

  @post('/services/{id}/service-segments', {
    responses: {
      '200': {
        description: 'Service model instance',
        content: { 'application/json': { schema: { 'x-ts-type': ServiceSegment } } },
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Service.prototype.id,
    @requestBody() serviceSegment: ServiceSegment,
  ): Promise<ServiceSegment> {
    return await this.serviceRepository.serviceSegments(id).create(serviceSegment);
  }

  @patch('/services/{id}/service-segments', {
    responses: {
      '200': {
        description: 'Service.ServiceSegment PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ServiceSegment, {partial: true}),
        },
      },
    })
    serviceSegment: Partial<ServiceSegment>,
    @param.query.object('where', getWhereSchemaFor(ServiceSegment)) where?: Where<ServiceSegment>,
  ): Promise<Count> {
    return await this.serviceRepository.serviceSegments(id).patch(serviceSegment, where);
  }

  @del('/services/{id}/service-segments', {
    responses: {
      '200': {
        description: 'Service.ServiceSegment DELETE success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(ServiceSegment)) where?: Where<ServiceSegment>,
  ): Promise<Count> {
    return await this.serviceRepository.serviceSegments(id).delete(where);
  }
}
