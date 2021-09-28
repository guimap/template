import { Request, ResponseToolkit } from "hapi";
import Boom from 'boom'
import IRoute from "../../structures/IRoute"
import { DependencyContainer } from 'tsyringe'
import ServiceExample from "../../services/ServiceExample";


const route: IRoute = {
  method: 'GET',
  path: '/test/error',
  handler: (request: Request, response: ResponseToolkit, container: DependencyContainer ) => {
    try {
      const serviceExample = container.resolve(ServiceExample)
      serviceExample.throwAnError()
      return 'ae'
    } catch (err) {
      console.log(err , Boom.boomify)
      //  Handle with specific error
      // if (err instanceof BaseError) return Boom.boomify(err, { statusCode: err.statusCode || 500 })
      
      return Boom.boomify(err, { statusCode: err.statusCode || 500 })
    }
  }
}

export default route
