import { Request, ResponseToolkit } from "hapi";
import { DependencyContainer } from "tsyringe";
import IRoute from "../../structures/IRoute"


const route: IRoute = {
  method: 'GET',
  path: '/test',
  handler: async (request: Request, response: ResponseToolkit, container: DependencyContainer) => {
    return 'This is a example route'
  }
}

export default route
