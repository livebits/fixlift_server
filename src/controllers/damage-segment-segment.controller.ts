import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
} from '@loopback/rest';
import {
  DamageSegment,
  Segment,
} from '../models';
import {DamageSegmentRepository} from '../repositories';

export class DamageSegmentSegmentController {
  constructor(
    @repository(DamageSegmentRepository)
    public damageSegmentRepository: DamageSegmentRepository,
  ) { }

  @get('/damage-segments/{id}/segment', {
    responses: {
      '200': {
        description: 'Segment belonging to DamageSegment',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Segment } },
          },
        },
      },
    },
  })
  async getSegment(
    @param.path.number('id') id: typeof DamageSegment.prototype.id,
  ): Promise<Segment> {
    return await this.damageSegmentRepository.segment(id);
  }
}
