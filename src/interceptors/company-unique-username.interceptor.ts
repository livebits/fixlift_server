import {
  /* inject, */
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
  bind,
} from '@loopback/context';
import {ValidationError} from 'loopback-datasource-juggler';
import {HttpErrors} from '@loopback/rest';
import {UserController, CompanyController} from '../controllers';
import {Where, FilterBuilder, WhereBuilder} from '@loopback/repository';
import {User} from '../models';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@bind({tags: {namespace: 'interceptors', name: 'CompanyUniqueUsername'}})
export class CompanyUniqueUsernameInterceptor implements Provider<Interceptor> {
  /*
  constructor() {}
  */

  /**
   * This method is used by LoopBack context to produce an interceptor function
   * for the binding.
   *
   * @returns An interceptor function
   */
  value() {
    return this.intercept.bind(this);
  }

  /**
   * The logic to intercept an invocation
   * @param invocationCtx - Invocation context
   * @param next - A function to invoke next interceptor or the target method
   */
  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ) {
    // Add pre-invocation logic here

    let cc: CompanyController = <CompanyController>invocationCtx.target;

    let whereBuilder = {};
    if (invocationCtx.methodName === 'create') {
      whereBuilder = {username: invocationCtx.args[0].username};
    } else {
      whereBuilder = {
        and: [
          {username: invocationCtx.args[1].username},
          {id: {neq: invocationCtx.args[1].user_id}},
        ],
      };
    }

    const searchByUsername = await cc.userRepository.count(whereBuilder);

    if (searchByUsername.count > 0) {
      throw new HttpErrors.UnprocessableEntity(`code:uniqueUsername`);
    }

    const result = await next();

    // Add post-invocation logic here
    return result;
  }
}
