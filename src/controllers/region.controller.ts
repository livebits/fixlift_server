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
import { Region } from '../models';
import { RegionRepository } from '../repositories';
import { authorize, PermissionKey } from '../authorization';
import { authenticate, UserProfile, AuthenticationBindings } from '@loopback/authentication';
import { inject } from '@loopback/core';

export class RegionController {
  constructor(
    @repository(RegionRepository)
    public regionRepository: RegionRepository,
  ) { }

  @authenticate('jwt')
  @post('/regions', {
    responses: {
      '200': {
        description: 'Region model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Region } } },
      },
    },
  })
  async create(
    @requestBody() region: Region,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<Region> {
    region.companyUserId = Number(currentUser.id);
    return await this.regionRepository.create(region);
  }

  @get('/regions/count', {
    responses: {
      '200': {
        description: 'Region model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Region)) where?: Where<Region>,
  ): Promise<Count> {
    return await this.regionRepository.count(where);
  }

  @authenticate('jwt')
  @get('/regions', {
    responses: {
      '200': {
        description: 'Array of Region model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Region } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Region)) filter?: Filter<Region>,
  ): Promise<Region[]> {
    return await this.regionRepository.find(filter);
  }

  @patch('/regions', {
    responses: {
      '200': {
        description: 'Region PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody() region: Region,
    @param.query.object('where', getWhereSchemaFor(Region)) where?: Where<Region>,
  ): Promise<Count> {
    return await this.regionRepository.updateAll(region, where);
  }

  @get('/regions/{id}', {
    responses: {
      '200': {
        description: 'Region model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Region } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Region> {
    return await this.regionRepository.findById(id);
  }

  @patch('/regions/{id}', {
    responses: {
      '204': {
        description: 'Region PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() region: Region,
  ): Promise<void> {
    await this.regionRepository.updateById(id, region);
  }

  @put('/regions/{id}', {
    responses: {
      '204': {
        description: 'Region PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() region: Region,
  ): Promise<void> {
    await this.regionRepository.replaceById(id, region);
  }

  @del('/regions/{id}', {
    responses: {
      '204': {
        description: 'Region DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.regionRepository.deleteById(id);
  }
}
