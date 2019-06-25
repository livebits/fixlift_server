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
import { ServiceUser } from '../models';
import { ServiceUserRepository } from '../repositories';
import { authenticate, AuthenticationBindings, UserProfile } from '@loopback/authentication';
import { inject } from '@loopback/core';

export class ServiceUserController {
  constructor(
    @repository(ServiceUserRepository)
    public serviceUserRepository: ServiceUserRepository,
  ) { }

  @authenticate('jwt')
  @post('/service-users', {
    responses: {
      '200': {
        description: 'ServiceUser model instance',
        content: { 'application/json': { schema: { 'x-ts-type': ServiceUser } } },
      },
    },
  })
  async create(
    @requestBody() serviceUser: ServiceUser,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<ServiceUser> {
    serviceUser.companyUserId = Number(currentUser.id);
    return await this.serviceUserRepository.create(serviceUser);
  }

  @get('/service-users/count', {
    responses: {
      '200': {
        description: 'ServiceUser model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(ServiceUser)) where?: Where<ServiceUser>,
  ): Promise<Count> {
    return await this.serviceUserRepository.count(where);
  }

  @get('/service-users', {
    responses: {
      '200': {
        description: 'Array of ServiceUser model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': ServiceUser } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(ServiceUser)) filter?: Filter<ServiceUser>,
  ): Promise<ServiceUser[]> {
    return await this.serviceUserRepository.find(filter);
  }

  @patch('/service-users', {
    responses: {
      '200': {
        description: 'ServiceUser PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody() serviceUser: ServiceUser,
    @param.query.object('where', getWhereSchemaFor(ServiceUser)) where?: Where<ServiceUser>,
  ): Promise<Count> {
    return await this.serviceUserRepository.updateAll(serviceUser, where);
  }

  @get('/service-users/{id}', {
    responses: {
      '200': {
        description: 'ServiceUser model instance',
        content: { 'application/json': { schema: { 'x-ts-type': ServiceUser } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<ServiceUser> {
    return await this.serviceUserRepository.findById(id);
  }

  @patch('/service-users/{id}', {
    responses: {
      '204': {
        description: 'ServiceUser PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() serviceUser: ServiceUser,
  ): Promise<void> {
    await this.serviceUserRepository.updateById(id, serviceUser);
  }

  @put('/service-users/{id}', {
    responses: {
      '204': {
        description: 'ServiceUser PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() serviceUser: ServiceUser,
  ): Promise<void> {
    await this.serviceUserRepository.replaceById(id, serviceUser);
  }

  @del('/service-users/{id}', {
    responses: {
      '204': {
        description: 'ServiceUser DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.serviceUserRepository.deleteById(id);
  }
}
