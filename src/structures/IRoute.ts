export default interface IRoute {
    method: string
    path: string
    handler?: Function,
    options?: any
}