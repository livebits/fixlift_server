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
import { ChecklistCategory } from '../models';
import { ChecklistCategoryRepository } from '../repositories';
import { authenticate, AuthenticationBindings, UserProfile } from '@loopback/authentication';
import { inject } from '@loopback/core';

export class ChecklistCategoryController {
  constructor(
    @repository(ChecklistCategoryRepository)
    public checklistCategoryRepository: ChecklistCategoryRepository,
  ) { }

  @authenticate('jwt')
  @post('/checklist-categories', {
    responses: {
      '200': {
        description: 'ChecklistCategory model instance',
        content: { 'application/json': { schema: { 'x-ts-type': ChecklistCategory } } },
      },
    },
  })
  async create(
    @requestBody() checklistCategory: ChecklistCategory,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<ChecklistCategory> {
    checklistCategory.companyUserId = Number(currentUser.id);
    return await this.checklistCategoryRepository.create(checklistCategory);
  }

  @get('/checklist-categories/count', {
    responses: {
      '200': {
        description: 'ChecklistCategory model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(ChecklistCategory)) where?: Where<ChecklistCategory>,
  ): Promise<Count> {
    return await this.checklistCategoryRepository.count(where);
  }

  @authenticate('jwt')
  @get('/checklist-categories', {
    responses: {
      '200': {
        description: 'Array of ChecklistCategory model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': ChecklistCategory } },
          },
        },
      },
    },
  })
  async find(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @param.query.object('filter', getFilterSchemaFor(ChecklistCategory)) filter?: Filter<ChecklistCategory>,
  ): Promise<ChecklistCategory[]> {

    if (filter !== undefined) {
      if (filter.where !== undefined) {
        filter.where = { and: [{ companyUserId: Number(currentUser.id) }, filter.where] };
      } else {
        filter.where = { and: [{ companyUserId: Number(currentUser.id) }] };
      }
    } else {
      filter = { where: { and: [{ companyUserId: Number(currentUser.id) }] } };
    }

    return await this.checklistCategoryRepository.find(filter);
  }

  @patch('/checklist-categories', {
    responses: {
      '200': {
        description: 'ChecklistCategory PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody() checklistCategory: ChecklistCategory,
    @param.query.object('where', getWhereSchemaFor(ChecklistCategory)) where?: Where<ChecklistCategory>,
  ): Promise<Count> {
    return await this.checklistCategoryRepository.updateAll(checklistCategory, where);
  }

  @get('/checklist-categories/{id}', {
    responses: {
      '200': {
        description: 'ChecklistCategory model instance',
        content: { 'application/json': { schema: { 'x-ts-type': ChecklistCategory } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<ChecklistCategory> {
    return await this.checklistCategoryRepository.findById(id);
  }

  @patch('/checklist-categories/{id}', {
    responses: {
      '204': {
        description: 'ChecklistCategory PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() checklistCategory: ChecklistCategory,
  ): Promise<void> {
    await this.checklistCategoryRepository.updateById(id, checklistCategory);
  }

  @put('/checklist-categories/{id}', {
    responses: {
      '204': {
        description: 'ChecklistCategory PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() checklistCategory: ChecklistCategory,
  ): Promise<void> {
    await this.checklistCategoryRepository.replaceById(id, checklistCategory);
  }

  @del('/checklist-categories/{id}', {
    responses: {
      '204': {
        description: 'ChecklistCategory DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.checklistCategoryRepository.deleteById(id);
  }
}
