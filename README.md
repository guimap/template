# Hapi 18 Template


## Descrição

Esse repositorio foi criado para ser um modelo de criação de APIs.

![modelo-a-seguir](https://www.aluminioremaza.com.br/wp-content/uploads/2017/04/forma-pudim.png)

### Node version
#### v14.16.0

## Start

1. `npm i`
2. `npm start`

## Start em mode de desenvolvimento

1. `npm run start:dev`

## Observations

> Mude o nome do projeto no `package.json` para que seja mostrado no Kibana


### Envs

```
PORT=
NODE_ENV=
SQUID_API_TOKEN=
AUTH0_SQUIDHUB_CLIENT_SECRET=
AUTH0_SQUIDHUB_CLIENT_ID=
AUTH0_SQUID_ADM_CLIENT_ID=
AUTH0_SQUID_ADM_CLIENT_SECRET=
HPA_MIN_PODS=
HPA_MAX_PODS=
ELASTIC_LOG_URL=
ELASTIC_LOG_USER=
ELASTIC_LOG_PASSWORD=
```

### Estrutura de pastas

#### Structures
Aqui fica localizado as interfaces/classe dos objetos, por exemplo, como um objeto usuário deve ser.
Dentro dessa pasta também tem a pasta `errors/`, lá você pode adicionar os erros da aplicação.

> **TODOS OS ERROS DEVEM ESTENDER A CLASSE `BaseError` SEGUNDO O MODELO ABAIXO.**
```ts
class MyError extends BaseError {
  constructor() {
    const messageError: string = 'Minha mensagem de erro'
    const statusCodeError: number = 400
    super(messageError, statusCodeError)
  }
}
```

#### Factory

Aqui voce pode cadastrar as factories da aplicação.
Factories é um design pattern que encapsula a complexidade de criação de um objeto, neste template utilizamos Factory para a criação da connection do banco.

#### Repositories

Essa pasta contem os arquivos que acessam a camada de dados, seja acesso a uma collection do banco de dados ou acesso a um serviço externo, portanto é nessa pasta que você cadastra seus `commands`, `queries` e `clients` de acesso a serviços externos.
Por exemplo, podemos criar um `UserRepository` que é responsável por Criar/Ler/Atualizar/Deletar todo dado que está inserido na collection `users`.
A vantagem de usar repository é que a camada de acesso ao dado é uma só para aplicação, caso queira mudar o tipo de banco, basta atualizar esse arquivo.

#### Routes
Aqui contem os arquivos declarativos de rota, é nessa pasta que criamos uma rota, aqui voce pode organizar em pastas (rotas pertinentes a usuarios ficam na pasta `usuarios`, rotas pertinentes a campanha ficam na pasta `campanhas`) ou apenas jogar o arquivo dentro dessa pasta. **TODO ARQUIVO DE ROTA DEVE TERMINAR COM  `.route.ts`, caso contrário, esse arquivo não será registrado.
Ex: `minha-rota.route.ts`


#### Services
Aqui colocamos os services, Services são arquivos que contem regras de negocio da aplicação, ou seja, todo service é a ponte entre a rota e o banco de dados, é no service que fazemos toda a logica de negocio necessária da aplicação


#### app-config.ts
Aqui contem as variaveis de ambiente, dessa forma conseguimos centralizar o acesso das variaveis.

#### app.ts
Aqui criamos o servidor e registramos as depedencias injection da aplicação, como conexão de banco de função de log.

#### AppServer.ts
Aqui é a classe que cria o objeto de servidor.

#### index.ts
Entrypoint da aplicação
---

### Arquitetura do projeto
Dividimos a aplição em 3 camadas
- Camada de apresentação (`routes`)
  - Essa camada é responsável por receber a requisição e tratar os dados, para que seja encaminhado para a próxima camada (`services`). é nessa camada que fazemos TODAS as validações de input, voce pode usar o **JOI** para facilitar esse trabalho.

- Camada de serviço (`services`)
  - Essa camada é a ponte entre a camada de apresentação (`routes`) e a camada de dados (`repositories`), é nessa camada que contem TODA a regra de negócio, nessa camada tratamos o dado, e usamos os `repositories` para salvar em seus respectivos lugares

- Camada de dados (`repositories`)
  - Essa camada é responsável por receber os dados da camada anterior (`services`) e salvar na fonte de dados, seja ela um banco de dados, fila de pubsub ou um serviço externo.

A requisição passaria pelas seguintes camadas:

_Route -> Service -> Repository_

### Service Injection
Esse projeto utiliza container Injeção de depedencia, isso significa que, em qualquer camada é possível recuperar uma depedencia, por exemplo, se no arquivo `app.ts` eu criar o arquivo de conexão e registrar dentro do container, futuramente dentro dos Repositories (ou service caso seja necessário também) usar essa depedencia.

Todo arquivo `route` contem 3 parametros dentro do `handler`

- request: Objeto Request Hapi
- response: Objeto Response Hapi
- container: o container de depedencia, é aqui que conseguimos recuperar qualquer depedencia, seguindo um declarção de rota comum:

```ts
const route: IRoute = {
  path: '/my/route',
  method: 'GET',
  handler: async (request: Request, response: ResponseToolkit, container: DependencyContainer) => {

    //  Restante da logica
  }
}

export default route
```

É possível recuperar o objeto `appConfig` que é declarado e registrado no arquivo [`app.ts`](./src/app.ts) usando o comando `container.resolve('appConfig')`

```ts
const route: IRoute = {
  path: '/my/route',
  method: 'GET',
  handler: async (request: Request, response: ResponseToolkit, container: DependencyContainer) => {
    //  Recupera a depedencia appConfig
    const appConfig: IAppConfig = container.resolve('appConfig')
    //  Resto do codigo
  }
}

export default route
```

Caso não queira registrar a depedencia de forma manual, é possivel também utilizar annotations, ou seja, marcamos que uma classe é injetavel usando a annotation `@injectable` e depois injetamos essa depedencia no construtor de outra classe, por exemplo:
```ts
import {injectable, inject} from "tsyringe";

@injectable()
class Bar {
  // ...
}

//  Outro arquivo.
@injectable()
class Foo {
  constructor(@inject("Bar") private Bar?: Bar) {}
}
```

Para mais info consulte a doc do lib [Tsyringe](https://github.com/microsoft/tsyringe)


