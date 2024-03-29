import {
  /* inject, */
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
  bind,
} from '@loopback/context';
import { ValidationError } from 'loopback-datasource-juggler';
import { HttpErrors } from '@loopback/rest';
import { UserController } from '../controllers';
import { Where, FilterBuilder, WhereBuilder } from '@loopback/repository';
import { User } from '../models';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@bind({ tags: { namespace: 'interceptors', name: 'UniqueUsername' } })
export class UniqueUsernameInterceptor implements Provider<Interceptor> {
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

    let uc: UserController = <UserController>invocationCtx.target;

    let whereBuilder = {};
    if (invocationCtx.methodName === 'create') {
      // whereBuilder.eq('username', invocationCtx.args[0].username);
      whereBuilder = { username: invocationCtx.args[0].username };
    } else {
      // whereBuilder
      //   .eq('username', invocationCtx.args[1].username)
      //   .neq('id', invocationCtx.args[1].id);
      whereBuilder = {
        and: [
          { username: invocationCtx.args[1].username },
          { id: { neq: invocationCtx.args[1].id } },
        ],
      };
    }

    const searchByUsername = await uc.userRepository.count(whereBuilder);

    if (searchByUsername.count > 0) {
      throw new HttpErrors.UnprocessableEntity(`code:uniqueUsername`);
    }

    const result = await next();

    // Add post-invocation logic here
    return result;
  }
}
