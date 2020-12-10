// Require the framework and instantiate it
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
