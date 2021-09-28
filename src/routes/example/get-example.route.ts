import Joi from 'joi'
import { Request, ResponseToolkit } from 'hapi'
import Boom from 'boom'
import ServiceExample from '../../services/ServiceExample'
import IRoute from '../../structures/IRoute'
import { DependencyContainer } from 'tsyringe'
import ILog from '../../structures/ILog'

const route: IRoute = {
  path: '/user/{name}',
  method: 'GET',
  handler: async (request: Request, _: ResponseToolkit, container: DependencyContainer) => {
    const log: ILog = container.resolve('log')
    try {
      const name = request.params.name
      const serviceExample: ServiceExample = container.resolve(ServiceExample)
      return await serviceExample.welcomeUser(name)
    } catch (err) {
      log.error(err)
      return Boom.boomify(err, { statusCode: err.statusCode || 500 })
    }
  },
  options: {
    validate: {
      params: {
        name: Joi.string().required()
      }
    }
  }
}

export default route