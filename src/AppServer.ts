import { inject, injectable, DependencyContainer } from 'tsyringe'

import { Server, ResponseToolkit, Request } from "hapi";
import Boom from 'boom'
import { IAppConfig } from './app-config'

import * as glob from 'glob'
import * as path from 'path'
import * as HapiSwagger from 'hapi-swagger'

import IRoute from "./structures/IRoute";
import ILog from "./structures/ILog";




@injectable()
export default class AppServer {
  constructor (
    @inject("log") private log?: ILog,
    @inject("appConfig") private appConfig?: IAppConfig
  ) {

  }
  public async start(container: DependencyContainer): Promise<Server> {
    try {
      const server = await this.createServer()
      await this.registerPlugins(server)
      await this.registerAuthenticationOnServer(server)
      await this.registerSwagger(server)
      await this.registerRoutes(server, container)
      
      console.info(`Server running in ${this.appConfig.port} port.`)
      await server.start()
  
      return server
    } catch (err) {
      throw err
    }
    
  }

  /**
   * @desc Cria a instancia do servidor
   */
  private async  createServer (): Promise<Server> {
    return new Server({
      port: this.appConfig.port || 6789,
      routes: {
        cors: {
          origin: ['*'],
          credentials: true,
          additionalHeaders: []
        }
      }
    })
  }

  /**
   * @desc Registra os plugins dentro do servidoor
   * @param server <Server>
   */
  private async registerPlugins (server: Server): Promise<Server> {
    const googSequelizePlugin = {
      plugin: require('good'),
      options: {
        ops: {
          interval: 1000
        },
        reporters: {
          console: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ log: '*', response: '*', error: '*' }]
          }, {
            module: 'good-console',
            args: [{
              format: 'YYYY/MM/DD HH:mm:ss'
            }]
          }, 'stdout']
        }
      }
    }
    
    
    await server.register([
      googSequelizePlugin,
      require('sq-winston').middlewares.hapi17,
      require('hapi-auth-jwt2'),
      require('vision'),
      require('inert'),
      {
        plugin: require('lout'),
        options: {
          apiVersion: require('../package.json').version
        }
      },
      require('felicity-status').hapi18
    ])
    return server
  }

  private async registerSwagger (server) {
    console.log('registering swagger')
    const swaggerOptions = {
      info: {
        title: `${require('../package.json').name} Documentation`,
        version: require('../package.json').version
      },
      // auth: 'token'
    }

    await server.register({
      plugin: HapiSwagger,
      options: swaggerOptions
    })

    return server
  }

  /**
   * @desc Registra no servidor as strategies para resolver os JWT do hub e o ADM 
   * @param server 
   */
  private async registerAuthenticationOnServer(server: Server): Promise<Server> {
    server.auth.strategy('token', 'jwt', {
      key: Buffer.from(this.appConfig.admClientSecret, 'base64'),
      validate: () => ({ isValid: true }),
      verifyOptions: {
        algorithms: ['HS256'],
        audience: this.appConfig.admClientId
      }
    })

    server.auth.strategy('squid-hub', 'jwt', {
      key: Buffer.from(this.appConfig.hubClientSecret, 'utf8'),
      validate: () => ({ isValid: true }),
      verifyOptions: {
        algorithms: ['HS256'],
        audience: this.appConfig.hubClientId
      }
    })
    return server
  }

  private async registerRoutes (server: Server, container: DependencyContainer) {
    const routesPaths: string[] = glob.sync(path.join(__dirname, 'routes', '**', '*.route.+(js|ts)',))
    console.info('Registering routes')
    const routes: IRoute[] = await Promise.all<IRoute>(
      routesPaths.map(async file => {
        const importedFile = await import(path.resolve(file))
        const route  = importedFile.default
        return route
      })
    )
    
    for (const route of routes) {
      server.route({
        ...route,
        handler: async (request: Request, response: ResponseToolkit, ) => {
          console.log('ae')
          return route.handler(request, response, container)
        }
      })
    }

    //  Register Default Route to 404
    server.route({
      method: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      path: '/{any*}',
      handler: (request: Request, response: ResponseToolkit) => {
        return Boom.notFound('Opps, this route doesnt exists')
      }
    })
    return server
  }
}