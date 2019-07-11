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
import { UserController, ServiceUserController, CustomerController } from '../controllers';
import { Where, FilterBuilder, WhereBuilder } from '@loopback/repository';
import { User } from '../models';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@bind({ tags: { namespace: 'interceptors', name: 'UniqueMobile' } })
export class UniqueMobileInterceptor implements Provider<Interceptor> {
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
    let searchByMobile: number = 0;

    if (invocationCtx instanceof ServiceUserController) {
      let suc: ServiceUserController = <ServiceUserController>invocationCtx.target;
      let whereBuilder = {};
      if (invocationCtx.methodName === 'create') {
        whereBuilder = { mobile: invocationCtx.args[0].mobile };

      } else {
        whereBuilder = {
          and: [
            { mobile: invocationCtx.args[1].mobile },
            { id: { neq: invocationCtx.args[1].id } },
          ],
        };
      }

      const result = await suc.serviceUserRepository.count(whereBuilder);
      searchByMobile = result.count;

      if (searchByMobile == 0) {

        const result2 = await suc.customerRepository.count(whereBuilder);
        searchByMobile = result2.count;
      }

    } else {

      let cc: CustomerController = <CustomerController>invocationCtx.target;
      let whereBuilder = {};
      if (invocationCtx.methodName === 'create') {
        whereBuilder = { mobile: invocationCtx.args[0].mobile };

      } else {
        whereBuilder = {
          and: [
            { mobile: invocationCtx.args[1].mobile },
            { id: { neq: invocationCtx.args[1].id } },
          ],
        };
      }

      const result = await cc.customerRepository.count(whereBuilder);
      searchByMobile = result.count;

      if (searchByMobile == 0) {

        const result2 = await cc.serviceUserRepository.count(whereBuilder);
        searchByMobile = result2.count;
      }
    }



    if (searchByMobile > 0) {
      throw new HttpErrors.UnprocessableEntity(`code:uniqueMobile`);
    }

    const result = await next();

    // Add post-invocation logic here
    return result;
  }
}
