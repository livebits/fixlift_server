import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
} from '@loopback/rest';
import {
  Lift,
  DeviceType,
} from '../models';
import {LiftRepository} from '../repositories';

export class LiftDeviceTypeController {
  constructor(
    @repository(LiftRepository)
    public liftRepository: LiftRepository,
  ) { }

  @get('/lifts/{id}/device-type', {
    responses: {
      '200': {
        description: 'DeviceType belonging to Lift',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': DeviceType } },
          },
        },
      },
    },
  })
  async getDeviceType(
    @param.path.number('id') id: typeof Lift.prototype.id,
  ): Promise<DeviceType> {
    return await this.liftRepository.deviceType(id);
  }
}
