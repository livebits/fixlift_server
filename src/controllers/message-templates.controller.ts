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
import { MessageTemplate } from '../models';
import { MessageTemplateRepository } from '../repositories';
import { authenticate, AuthenticationBindings, UserProfile } from '@loopback/authentication';
import { inject } from '@loopback/core';

export class MessageTemplatesController {
  constructor(
    @repository(MessageTemplateRepository)
    public messageTemplateRepository: MessageTemplateRepository,
  ) { }

  @post('/message-templates', {
    responses: {
      '200': {
        description: 'MessageTemplate model instance',
        content: { 'application/json': { schema: { 'x-ts-type': MessageTemplate } } },
      },
    },
  })
  async create(@requestBody() messageTemplate: MessageTemplate): Promise<MessageTemplate> {
    return await this.messageTemplateRepository.create(messageTemplate);
  }

  @get('/message-templates/count', {
    responses: {
      '200': {
        description: 'MessageTemplate model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(MessageTemplate)) where?: Where<MessageTemplate>,
  ): Promise<Count> {
    return await this.messageTemplateRepository.count(where);
  }

  @authenticate('jwt')
  @get('/message-templates', {
    responses: {
      '200': {
        description: 'Array of MessageTemplate model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': MessageTemplate } },
          },
        },
      },
    },
  })
  async find(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @param.query.object('filter', getFilterSchemaFor(MessageTemplate)) filter?: Filter<MessageTemplate>,
  ): Promise<MessageTemplate[]> {

    return await this.messageTemplateRepository.find(filter);
  }

  @patch('/message-templates', {
    responses: {
      '200': {
        description: 'MessageTemplate PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MessageTemplate, { partial: true }),
        },
      },
    })
    messageTemplate: MessageTemplate,
    @param.query.object('where', getWhereSchemaFor(MessageTemplate)) where?: Where<MessageTemplate>,
  ): Promise<Count> {
    return await this.messageTemplateRepository.updateAll(messageTemplate, where);
  }

  @get('/message-templates/{id}', {
    responses: {
      '200': {
        description: 'MessageTemplate model instance',
        content: { 'application/json': { schema: { 'x-ts-type': MessageTemplate } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<MessageTemplate> {
    return await this.messageTemplateRepository.findById(id);
  }

  @patch('/message-templates/{id}', {
    responses: {
      '204': {
        description: 'MessageTemplate PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MessageTemplate, { partial: true }),
        },
      },
    })
    messageTemplate: MessageTemplate,
  ): Promise<void> {
    await this.messageTemplateRepository.updateById(id, messageTemplate);
  }

  @put('/message-templates/{id}', {
    responses: {
      '204': {
        description: 'MessageTemplate PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() messageTemplate: MessageTemplate,
  ): Promise<void> {
    await this.messageTemplateRepository.replaceById(id, messageTemplate);
  }

  @del('/message-templates/{id}', {
    responses: {
      '204': {
        description: 'MessageTemplate DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.messageTemplateRepository.deleteById(id);
  }
}
