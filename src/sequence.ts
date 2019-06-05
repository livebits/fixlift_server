import { inject, Getter } from '@loopback/context';
import {
  FindRoute,
  InvokeMethod,
  ParseParams,
  Reject,
  RequestContext,
  RestBindings,
  Send,
  SequenceHandler,
  HttpErrors,
} from '@loopback/rest';
import { AuthenticationBindings, AUTHENTICATION_STRATEGY_NOT_FOUND, USER_PROFILE_NOT_FOUND, UserProfile, AuthenticateFn, UserService } from '@loopback/authentication';

import {
  AuthorizatonBindings,
  AuthorizeFn,
  AuthorizeErrorKeys,
  UserPermissionsFn,
  PermissionKey,
  AuthorizationMetadata,
} from './authorization';
import { User } from './models';
import { authenticate, STRATEGY } from 'loopback4-authentication';
import { UserServiceBindings } from './keys';
import { Credentials, UserRepository } from './repositories';
import { repository } from '@loopback/repository';

const SequenceActions = RestBindings.SequenceActions;

export class MySequence implements SequenceHandler {
  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject(AuthenticationBindings.AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn,
    @inject(AuthorizatonBindings.USER_PERMISSIONS)
    protected fetchUserPermissons: UserPermissionsFn,
    @inject(AuthorizatonBindings.AUTHORIZE_ACTION)
    protected checkAuthorization: AuthorizeFn,
    @inject.getter(AuthorizatonBindings.METADATA)
    private readonly getMetadata: Getter<AuthorizationMetadata>,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, Credentials>,
    @repository(UserRepository) public userRepository: UserRepository,
  ) { }

  async handle(context: RequestContext) {
    try {
      const { request, response } = context;
      const route = this.findRoute(request);

      // Do authentication of the user and fetch user permissions below
      const authUser = await this.authenticateRequest(request);

      //get method authorize permissions
      const metadata: AuthorizationMetadata = await this.getMetadata();

      if (metadata && authUser) {
        //get user roles and permissions
        let user: User = await this.userRepository.findById(Number(authUser.id));

        // let roles = await this.userRepository.roles(user.id).find();

        // Parse and calculate user permissions based on role and user level
        const permissions: PermissionKey[] = this.fetchUserPermissons(
          user.permissions ? user.permissions : [],
          [],
        );

        // This is main line added to sequence
        // where we are invoking the authorize action function to check for access
        const isAccessAllowed: boolean = await this.checkAuthorization(
          permissions,
        );
        if (!isAccessAllowed) {
          throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
        }
      }

      const args = await this.parseParams(request, route);
      const result = await this.invoke(route, args);
      this.send(response, result);
    } catch (err) {

      //
      // The authentication action utilizes a strategy resolver to find
      // an authentication strategy by name, and then it calls
      // strategy.authenticate(request).
      //
      // The strategy resolver throws a non-http error if it cannot
      // resolve the strategy. When the strategy resolver obtains
      // a strategy, it calls strategy.authenticate(request) which
      // is expected to return a user profile. If the user profile
      // is undefined, then it throws a non-http error.
      //
      // It is necessary to catch these errors and add HTTP-specific status
      // code property.
      //
      // Errors thrown by the strategy implementations already come
      // with statusCode set.
      //
      // In the future, we want to improve `@loopback/rest` to provide
      // an extension point allowing `@loopback/authentication` to contribute
      // mappings from error codes to HTTP status codes, so that application
      // don't have to map codes themselves.
      if (
        err.code === AUTHENTICATION_STRATEGY_NOT_FOUND ||
        err.code === USER_PROFILE_NOT_FOUND
      ) {
        Object.assign(err, { statusCode: 401 });
      }

      this.reject(context, err);
    }
  }
}
