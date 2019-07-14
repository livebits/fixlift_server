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
import { Segment } from '../models';
import { SegmentRepository } from '../repositories';
import { authenticate, AuthenticationBindings, UserProfile } from '@loopback/authentication';
import { inject } from '@loopback/core';

export class SegmentController {
  constructor(
    @repository(SegmentRepository)
    public segmentRepository: SegmentRepository,
  ) { }

  @authenticate('jwt')
  @post('/segments', {
    responses: {
      '200': {
        description: 'Segment model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Segment } } },
      },
    },
  })
  async create(@requestBody() segment: Segment,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<Segment> {
    segment.companyUserId = Number(currentUser.id);
    return await this.segmentRepository.create(segment);
  }

  @get('/segments/count', {
    responses: {
      '200': {
        description: 'Segment model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Segment)) where?: Where<Segment>,
  ): Promise<Count> {
    return await this.segmentRepository.count(where);
  }

  @get('/segments', {
    responses: {
      '200': {
        description: 'Array of Segment model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Segment } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Segment)) filter?: Filter<Segment>,
  ): Promise<Segment[]> {
    return await this.segmentRepository.find(filter);
  }

  @authenticate('jwt')
  @patch('/segments', {
    responses: {
      '200': {
        description: 'Segment PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody() segment: Segment,
    @param.query.object('where', getWhereSchemaFor(Segment)) where?: Where<Segment>,
  ): Promise<Count> {
    return await this.segmentRepository.updateAll(segment, where);
  }

  @get('/segments/{id}', {
    responses: {
      '200': {
        description: 'Segment model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Segment } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Segment> {
    return await this.segmentRepository.findById(id);
  }

  @patch('/segments/{id}', {
    responses: {
      '204': {
        description: 'Segment PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() segment: Segment,
  ): Promise<void> {
    await this.segmentRepository.updateById(id, segment);
  }

  @put('/segments/{id}', {
    responses: {
      '204': {
        description: 'Segment PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() segment: Segment,
  ): Promise<void> {
    await this.segmentRepository.replaceById(id, segment);
  }

  @del('/segments/{id}', {
    responses: {
      '204': {
        description: 'Segment DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.segmentRepository.deleteById(id);
  }

  //App apis
  @authenticate('jwt')
  @get('/segments/getCompanySegments/{company_id}', {
    responses: {
      '200': {
        description: 'Array of Checklist model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Segment } },
          },
        },
      },
    },
  })
  async getCompanySegments(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @param.path.number('company_id') companyId: number
  ): Promise<Segment[]> {

    return await this.segmentRepository.find({ where: { companyUserId: companyId } });
  }
}
