import { FastifyRequest, FastifyReply } from 'fastify'
import { postgraphile, PostGraphileResponseFastify3, PostGraphileResponse } from 'postgraphile'

export const setupMiddleware = async (fastify: any, options: any): Promise<any> => {
  return await new Promise((resolve) => {
    const { databaseUri, schemas, middlewareOptions } = options
    const middleware = postgraphile(databaseUri, schemas, middlewareOptions)

    // https://github.com/graphile/postgraphile/blob/v4/examples/servers/fastify3/vanilla.ts
    /**
     * Converts a PostGraphile route handler into a Fastify request handler.
     */
    const convertHandler = (handler: (res: PostGraphileResponse) => Promise<void>) => async (
      request: FastifyRequest,
      reply: FastifyReply
    ) => await handler(new PostGraphileResponseFastify3(request, reply))

    // IMPORTANT: do **NOT** change these routes here; if you want to change the
    // routes, do so in PostGraphile options. If you change the routes here only
    // then GraphiQL won't know where to find the GraphQL endpoint and the GraphQL
    // endpoint won't know where to indicate the EventStream for watch mode is.
    // (There may be other problems too.)
    // OPTIONS requests, for CORS/etc
    fastify.options(middleware.graphqlRoute, convertHandler(middleware.graphqlRouteHandler))

    // This is the main middleware
    fastify.post(middleware.graphqlRoute, convertHandler(middleware.graphqlRouteHandler))

    // GraphiQL, if you need it
    if (middleware.options.graphiql != null && middleware.options.graphiql) {
      if (middleware.graphiqlRouteHandler != null) {
        fastify.head(middleware.graphiqlRoute, convertHandler(middleware.graphiqlRouteHandler))
        fastify.get(middleware.graphiqlRoute, convertHandler(middleware.graphiqlRouteHandler))
      }
      // Remove this if you don't want the PostGraphile logo as your favicon!
      if (middleware.faviconRouteHandler != null) {
        fastify.get('/favicon.ico', convertHandler(middleware.faviconRouteHandler))
      }
    }

    // If you need watch mode, this is the route served by the
    // X-GraphQL-Event-Stream header; see:
    // https://github.com/graphql/graphql-over-http/issues/48
    if (middleware.options.watchPg != null && middleware.options.watchPg) {
      if (middleware.eventStreamRouteHandler != null) {
        fastify.options(
          middleware.eventStreamRoute,
          convertHandler(middleware.eventStreamRouteHandler)
        )
        fastify.get(middleware.eventStreamRoute, convertHandler(middleware.eventStreamRouteHandler))
      }
    }
    resolve(middleware)
  })
}
