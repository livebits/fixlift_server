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
import { CustomerMessage } from '../models';
import { CustomerMessageRepository } from '../repositories';
import { authenticate, AuthenticationBindings, UserProfile } from '@loopback/authentication';
import { inject } from '@loopback/core';

export class CustomerMessagesController {
  constructor(
    @repository(CustomerMessageRepository)
    public customerMessageRepository: CustomerMessageRepository,
  ) { }

  @post('/customer-messages', {
    responses: {
      '200': {
        description: 'CustomerMessage model instance',
        content: { 'application/json': { schema: { 'x-ts-type': CustomerMessage } } },
      },
    },
  })
  async create(@requestBody() customerMessage: CustomerMessage): Promise<CustomerMessage> {
    return await this.customerMessageRepository.create(customerMessage);
  }

  @get('/customer-messages/count', {
    responses: {
      '200': {
        description: 'CustomerMessage model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(CustomerMessage)) where?: Where<CustomerMessage>,
  ): Promise<Count> {
    return await this.customerMessageRepository.count(where);
  }

  @get('/customer-messages', {
    responses: {
      '200': {
        description: 'Array of CustomerMessage model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': CustomerMessage } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(CustomerMessage)) filter?: Filter<CustomerMessage>,
  ): Promise<CustomerMessage[]> {
    return await this.customerMessageRepository.find(filter);
  }

  @patch('/customer-messages', {
    responses: {
      '200': {
        description: 'CustomerMessage PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CustomerMessage, { partial: true }),
        },
      },
    })
    customerMessage: CustomerMessage,
    @param.query.object('where', getWhereSchemaFor(CustomerMessage)) where?: Where<CustomerMessage>,
  ): Promise<Count> {
    return await this.customerMessageRepository.updateAll(customerMessage, where);
  }

  @get('/customer-messages/{id}', {
    responses: {
      '200': {
        description: 'CustomerMessage model instance',
        content: { 'application/json': { schema: { 'x-ts-type': CustomerMessage } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<CustomerMessage> {
    return await this.customerMessageRepository.findById(id);
  }

  @patch('/customer-messages/{id}', {
    responses: {
      '204': {
        description: 'CustomerMessage PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CustomerMessage, { partial: true }),
        },
      },
    })
    customerMessage: CustomerMessage,
  ): Promise<void> {
    await this.customerMessageRepository.updateById(id, customerMessage);
  }

  @put('/customer-messages/{id}', {
    responses: {
      '204': {
        description: 'CustomerMessage PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() customerMessage: CustomerMessage,
  ): Promise<void> {
    await this.customerMessageRepository.replaceById(id, customerMessage);
  }

  @del('/customer-messages/{id}', {
    responses: {
      '204': {
        description: 'CustomerMessage DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.customerMessageRepository.deleteById(id);
  }

  @authenticate('jwt')
  @get('/customer-messages/filter', {
    responses: {
      '200': {
        description: 'CustomerMessage model instance',
        content: { 'application/json': { schema: { 'x-ts-type': CustomerMessage } } },
      },
    },
  })
  async filter(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
  ): Promise<any> {

    const sql = `SELECT m.*
      FROM customer_messages cm
      LEFT JOIN messages m ON m.id = cm.message_id
      WHERE cm.customer_id = ${currentUser.id}
      order by m.id desc`;

    return await this.customerMessageRepository.query(sql);
  }
}
