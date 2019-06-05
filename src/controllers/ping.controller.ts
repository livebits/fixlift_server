import { Request, RestBindings, get, ResponseObject, param } from '@loopback/rest';
import { inject } from '@loopback/context';
import {
  AuthenticationBindings,
  UserProfile,
  authenticate,
} from '@loopback/authentication';
import { authorize, PermissionKey } from '../authorization';

/**
 * OpenAPI response for ping()
 */
const PING_RESPONSE: ResponseObject = {
  description: 'Ping Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          greeting: { type: 'string' },
          date: { type: 'string' },
          url: { type: 'string' },
          headers: {
            type: 'object',
            properties: {
              'Content-Type': { type: 'string' },
            },
            additionalProperties: true,
          },
        },
      },
    },
  },
};

/**
 * A simple controller to bounce back http requests
 */
export class PingController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    // @inject(AuthenticationBindings.CURRENT_USER) private user: UserProfile
  ) { }

  // Map to `GET /ping`
  // @authorize([PermissionKey.ViewRoles])
  // @authenticate('jwt')
  @get('/ping', {
    responses: {
      '200': PING_RESPONSE,
    },
  })
  ping(): object {
    // Reply with a greeting, the current time, the url, and request headers
    return {
      greeting: 'Hello from LoopBack',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }

  @get('/', {
    responses: {
      '200': {
        description: 'greeting text',
        content: {
          'application/json': {
            schema: { type: 'string' },
          },
        },
      },
    },
  })
  greet(@param.query.string('name') name: string) {
    return `hello ${name}`;
  }
}
