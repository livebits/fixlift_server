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
import { Checklist } from '../models';
import { ChecklistRepository } from '../repositories';
import { authenticate, AuthenticationBindings, UserProfile } from '@loopback/authentication';
import { inject } from '@loopback/core';

export class ChecklistController {
  constructor(
    @repository(ChecklistRepository)
    public checklistRepository: ChecklistRepository,
  ) { }

  @authenticate('jwt')
  @post('/checklists', {
    responses: {
      '200': {
        description: 'Checklist model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Checklist } } },
      },
    },
  })
  async create(
    @requestBody() checklist: Checklist,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<Checklist> {
    checklist.companyUserId = Number(currentUser.id);
    return await this.checklistRepository.create(checklist);
  }

  @get('/checklists/count', {
    responses: {
      '200': {
        description: 'Checklist model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Checklist)) where?: Where<Checklist>,
  ): Promise<Count> {
    return await this.checklistRepository.count(where);
  }

  @get('/checklists', {
    responses: {
      '200': {
        description: 'Array of Checklist model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Checklist } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Checklist)) filter?: Filter<Checklist>,
  ): Promise<any> {

    const sql = `select ch.id, ch.title as title, ch.priority as priority, chc.title as checklistCategory
      from checklists ch
      left join checklist_categories chc on ch.checklist_category_id = chc.id
      order by ch.id desc`;

    return await this.checklistRepository.query(sql);

    // return await this.checklistRepository.find(filter);
  }

  @patch('/checklists', {
    responses: {
      '200': {
        description: 'Checklist PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody() checklist: Checklist,
    @param.query.object('where', getWhereSchemaFor(Checklist)) where?: Where<Checklist>,
  ): Promise<Count> {
    return await this.checklistRepository.updateAll(checklist, where);
  }

  @get('/checklists/{id}', {
    responses: {
      '200': {
        description: 'Checklist model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Checklist } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Checklist> {
    return await this.checklistRepository.findById(id);
  }

  @patch('/checklists/{id}', {
    responses: {
      '204': {
        description: 'Checklist PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() checklist: Checklist,
  ): Promise<void> {
    await this.checklistRepository.updateById(id, checklist);
  }

  @put('/checklists/{id}', {
    responses: {
      '204': {
        description: 'Checklist PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() checklist: Checklist,
  ): Promise<void> {
    await this.checklistRepository.replaceById(id, checklist);
  }

  @del('/checklists/{id}', {
    responses: {
      '204': {
        description: 'Checklist DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.checklistRepository.deleteById(id);
  }

  //App apis
  @authenticate('jwt')
  @get('/checklists/getCompanyChecklists/{company_id}', {
    responses: {
      '200': {
        description: 'Array of Checklist model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Checklist } },
          },
        },
      },
    },
  })
  async getCompanyChecklists(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @param.path.number('company_id') companyId: number
  ): Promise<any> {

    const sql = `select ch.id, ch.title as title, ch.priority as priority, chc.title as checklistCategory, chc.priority as checklistCategoryPriority
      from checklists ch
      left join checklist_categories chc on ch.checklist_category_id = chc.id
      where ch.company_user_id = ${companyId}
      order by ch.id desc`;


    return await this.checklistRepository.query(sql);
  }
}
