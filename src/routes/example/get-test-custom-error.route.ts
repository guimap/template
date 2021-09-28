import { Request, ResponseToolkit } from "hapi";
import Boom from 'boom'
import IRoute from "../../structures/IRoute"
import { DependencyContainer } from 'tsyringe'
import ServiceExample from "../../services/ServiceExample";
import ExampleCustomError from "../../structures/errors/ExampleCustomError";

const route: IRoute = {
  method: 'GET',
  path: '/test/custom/error',
  handler: (request: Request, response: ResponseToolkit, container: DependencyContainer ) => {
    try {
      const serviceExample = container.resolve(ServiceExample)
      serviceExample.throwACustomError()
    } catch (err) {
      console.log(err , Boom.boomify)
      //  Handle with specific error
      if (err instanceof ExampleCustomError) return response.response('Erro customizado foi tratado').code(err.statusCode)
      return Boom.boomify(err, { statusCode: err.statusCode || 500 })
    }
  }
}
export default route