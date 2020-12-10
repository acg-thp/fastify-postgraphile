# fastify-postgraphile

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)  ![CI workflow](https://github.com/alemagio/fastify-postgraphile/workflows/CI%20workflow/badge.svg)

`fastify-postgraphile` enables the use of [Postgraphile](https://www.graphile.org/postgraphile) in a Fastify application.

Supports Fastify versions `3.x`

## Install
```
npm i fastify-postgraphile
```

## Usage
Require `fastify-postgraphile` and register it as any other plugin, it will add a `graphql` reply decorator.
```js
const fastify = require('fastify')({ logger: true })

fastify.register(require('./lib/index.js'), {
  pool: {
    user: 'administrator',
    host: 'localhost',
    database: 'administrator',
    password: 'localhost',
    port: 5432
  },
  databaseUri: 'postgres://administrator:localhost@localhost:5432/administrator',
  schemas: 'public',
  middlewareEnabled: true,
  middlewareOptions: {
    graphiql: true,
    watchPg: true
  }
})

// Run the server!
fastify.listen(3000, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
})
```

## Acknowledgements

The code is a port for Fastify of [`postgraphile`](https://www.graphile.org/postgraphile).

## License

Licensed under [MIT](./LICENSE).<br/>
[`postgraphile` license](https://github.com/graphile/postgraphile/blob/v4/LICENSE.md)
