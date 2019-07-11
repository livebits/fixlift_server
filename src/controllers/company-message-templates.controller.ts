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
import { CompanyMessageTemplate } from '../models';
import { CompanyMessageTemplateRepository, MessageTemplateRepository } from '../repositories';
import { authenticate, AuthenticationBindings, UserProfile } from '@loopback/authentication';
import { inject } from '@loopback/core';

export class CompanyMessageTemplatesController {
  constructor(
    @repository(CompanyMessageTemplateRepository)
    public companyMessageTemplateRepository: CompanyMessageTemplateRepository,
    @repository(MessageTemplateRepository)
    public messageTemplateRepository: MessageTemplateRepository,
  ) { }

  @authenticate('jwt')
  @post('/company-message-templates', {
    responses: {
      '200': {
        description: 'CompanyMessageTemplate model instance',
        content: { 'application/json': { schema: { 'x-ts-type': CompanyMessageTemplate } } },
      },
    },
  })
  async create(
    @requestBody() companyMessageTemplate: CompanyMessageTemplate,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<any> {

    const sql = `SELECT cmt.id
      FROM company_message_templates cmt
      WHERE cmt.message_template_id = ${companyMessageTemplate.messageTemplateId}
      AND cmt.company_user_id = ${currentUser.id}`;

    const result = await this.companyMessageTemplateRepository.query(sql);

    //update current value
    if (result.length > 0) {
      return await this.companyMessageTemplateRepository.updateAll(companyMessageTemplate, { companyUserId: Number(currentUser.id), messageTemplateId: companyMessageTemplate.messageTemplateId });
    }
    //create new one
    else {
      companyMessageTemplate.companyUserId = Number(currentUser.id);

      return await this.companyMessageTemplateRepository.create(companyMessageTemplate);
    }
  }

  @get('/company-message-templates/count', {
    responses: {
      '200': {
        description: 'CompanyMessageTemplate model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(CompanyMessageTemplate)) where?: Where<CompanyMessageTemplate>,
  ): Promise<Count> {
    return await this.companyMessageTemplateRepository.count(where);
  }

  @get('/company-message-templates', {
    responses: {
      '200': {
        description: 'Array of CompanyMessageTemplate model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': CompanyMessageTemplate } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(CompanyMessageTemplate)) filter?: Filter<CompanyMessageTemplate>,
  ): Promise<CompanyMessageTemplate[]> {
    return await this.companyMessageTemplateRepository.find(filter);
  }

  @patch('/company-message-templates', {
    responses: {
      '200': {
        description: 'CompanyMessageTemplate PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CompanyMessageTemplate, { partial: true }),
        },
      },
    })
    companyMessageTemplate: CompanyMessageTemplate,
    @param.query.object('where', getWhereSchemaFor(CompanyMessageTemplate)) where?: Where<CompanyMessageTemplate>,
  ): Promise<Count> {
    return await this.companyMessageTemplateRepository.updateAll(companyMessageTemplate, where);
  }

  @authenticate('jwt')
  @get('/company-message-templates/{id}', {
    responses: {
      '200': {
        description: 'CompanyMessageTemplate model instance',
        content: { 'application/json': { schema: { 'x-ts-type': CompanyMessageTemplate } } },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<CompanyMessageTemplate> {

    const sql = `SELECT cmt.id as id, cmt.message_template_id as messageTemplateId,
      cmt.reminder_value as reminderValue, cmt.reminder_time_type_value as reminderTimeTypeValue,
      cmt.body, cmt.status, mt.property_title as propertyTitle
      FROM company_message_templates cmt
      LEFT JOIN message_templates mt ON mt.id = cmt.message_template_id
      WHERE cmt.message_template_id = ${id} AND cmt.company_user_id = ${currentUser.id}`;

    const result = await this.companyMessageTemplateRepository.query(sql);

    if (result.length > 0) {
      return result[0];
    }

    return await this.messageTemplateRepository.findById(id);
  }

  @patch('/company-message-templates/{id}', {
    responses: {
      '204': {
        description: 'CompanyMessageTemplate PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CompanyMessageTemplate, { partial: true }),
        },
      },
    })
    companyMessageTemplate: CompanyMessageTemplate,
  ): Promise<void> {
    await this.companyMessageTemplateRepository.updateById(id, companyMessageTemplate);
  }

  @put('/company-message-templates/{id}', {
    responses: {
      '204': {
        description: 'CompanyMessageTemplate PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() companyMessageTemplate: CompanyMessageTemplate,
  ): Promise<void> {
    await this.companyMessageTemplateRepository.replaceById(id, companyMessageTemplate);
  }

  @del('/company-message-templates/{id}', {
    responses: {
      '204': {
        description: 'CompanyMessageTemplate DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.companyMessageTemplateRepository.deleteById(id);
  }
}
