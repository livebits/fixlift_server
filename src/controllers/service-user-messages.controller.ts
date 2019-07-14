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
import { ServiceUserMessage } from '../models';
import { ServiceUserMessageRepository } from '../repositories';
import { authenticate, AuthenticationBindings, UserProfile } from '@loopback/authentication';
import { inject } from '@loopback/core';

export class ServiceUserMessagesController {
  constructor(
    @repository(ServiceUserMessageRepository)
    public serviceUserMessageRepository: ServiceUserMessageRepository,
  ) { }

  @post('/service-user-messages', {
    responses: {
      '200': {
        description: 'ServiceUserMessage model instance',
        content: { 'application/json': { schema: { 'x-ts-type': ServiceUserMessage } } },
      },
    },
  })
  async create(@requestBody() serviceUserMessage: ServiceUserMessage): Promise<ServiceUserMessage> {
    return await this.serviceUserMessageRepository.create(serviceUserMessage);
  }

  @get('/service-user-messages/count', {
    responses: {
      '200': {
        description: 'ServiceUserMessage model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(ServiceUserMessage)) where?: Where<ServiceUserMessage>,
  ): Promise<Count> {
    return await this.serviceUserMessageRepository.count(where);
  }

  @get('/service-user-messages', {
    responses: {
      '200': {
        description: 'Array of ServiceUserMessage model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': ServiceUserMessage } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(ServiceUserMessage)) filter?: Filter<ServiceUserMessage>,
  ): Promise<ServiceUserMessage[]> {
    return await this.serviceUserMessageRepository.find(filter);
  }

  @patch('/service-user-messages', {
    responses: {
      '200': {
        description: 'ServiceUserMessage PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ServiceUserMessage, { partial: true }),
        },
      },
    })
    serviceUserMessage: ServiceUserMessage,
    @param.query.object('where', getWhereSchemaFor(ServiceUserMessage)) where?: Where<ServiceUserMessage>,
  ): Promise<Count> {
    return await this.serviceUserMessageRepository.updateAll(serviceUserMessage, where);
  }

  @get('/service-user-messages/{id}', {
    responses: {
      '200': {
        description: 'ServiceUserMessage model instance',
        content: { 'application/json': { schema: { 'x-ts-type': ServiceUserMessage } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<ServiceUserMessage> {
    return await this.serviceUserMessageRepository.findById(id);
  }

  @patch('/service-user-messages/{id}', {
    responses: {
      '204': {
        description: 'ServiceUserMessage PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ServiceUserMessage, { partial: true }),
        },
      },
    })
    serviceUserMessage: ServiceUserMessage,
  ): Promise<void> {
    await this.serviceUserMessageRepository.updateById(id, serviceUserMessage);
  }

  @put('/service-user-messages/{id}', {
    responses: {
      '204': {
        description: 'ServiceUserMessage PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() serviceUserMessage: ServiceUserMessage,
  ): Promise<void> {
    await this.serviceUserMessageRepository.replaceById(id, serviceUserMessage);
  }

  @del('/service-user-messages/{id}', {
    responses: {
      '204': {
        description: 'ServiceUserMessage DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.serviceUserMessageRepository.deleteById(id);
  }

  //App api
  @authenticate('jwt')
  @get('/service-user-messages/filter', {
    responses: {
      '200': {
        description: 'CustomerMessage model instance',
        content: { 'application/json': { schema: { 'x-ts-type': ServiceUserMessage } } },
      },
    },
  })
  async filter(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
  ): Promise<any> {

    const sql = `SELECT m.id, m.created_on as createdOn, m.title, m.body,
      m.type, m.status
      FROM service_user_messages sm
      LEFT JOIN messages m ON m.id = sm.message_id
      WHERE sm.service_user_id = ${currentUser.id}
      order by m.id desc`;

    return await this.serviceUserMessageRepository.query(sql);
  }
}
