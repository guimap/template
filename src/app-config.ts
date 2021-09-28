import env from 'sugar-env'

export interface IAppConfig {
  port: string
  env: string
  squidApiToken: string
  hubClientSecret: string
  hubClientId: string
  admClientSecret: string
  admClientId: string

}

export const AppConfig: IAppConfig = {
  port: env.get('PORT', ''),
  env: env.get('NODE_ENV', ''),
  squidApiToken: env.get('SQUID_API_TOKEN', ''),
  hubClientSecret: env.get('AUTH0_SQUIDHUB_CLIENT_SECRET', ''),
  hubClientId: env.get('AUTH0_SQUIDHUB_CLIENT_ID', ''),
  admClientSecret: env.get('AUTH0_SQUID_ADM_CLIENT_ID', ''),
  admClientId: env.get('AUTH0_SQUID_ADM_CLIENT_SECRET', '')
}
export default AppConfig