import AppConfig from './app-config'
import { container } from 'tsyringe'
import debug = require('debug')

import ILog from './structures/ILog'

//  Server
import AppServer from './AppServer'
import ConnectionFactory from './factory/ConnectionFactory'



export async function init () {
  //  Register Depedency which is not a class
  container.register('appConfig', { useValue: AppConfig })
  container.register('log', { useValue: createLogInstance() })
  container.register('db', { useValue: ConnectionFactory.createConnection('mongodb') })


  //  Setup server
  const appServer = container.resolve(AppServer)
  await appServer.start(container)
}

function createLogInstance (): ILog {
  const logInfo = debug(`app:INFO`)
  const logError = debug(`app:ERROR`)
  return {
    info: logInfo,
    error: logError
  }
}