import { fastifyCors } from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import { fastify } from 'fastify';
import { serializerCompiler, validatorCompiler, hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { getAllLinks, createLink, getLink, getOriginalUrl, exportLinks, deleteLink } from './routes/link';

const server = fastify();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.setErrorHandler((error, request, reply) => { 
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: 'Validation error',
      error: error.validation,
    });
  }
  
  return reply.status(500).send({
    message: 'Internal server error',
    error: error.message,
    stack: error.stack,
  });
});

server.register(fastifyCors, {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}); 

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Brevly API',
      description: 'A comprehensive API for creating and managing shortened URLs with analytics and export capabilities.',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
});

server.register(fastifySwaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false,
  },
});

server.register(getAllLinks);
server.register(createLink);
server.register(getLink);
server.register(getOriginalUrl);
server.register(exportLinks);
server.register(deleteLink);

server.get('/health', async (request, reply) => {
  console.log('Health route called');
  return { status: 'ok' };
});

const PORT = parseInt(process.env.PORT || '3333');
server.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error('Server startup error:', err);
    process.exit(1);
  }
  console.log(`🚀 Server is running on ${address}`);
  console.log(`📚 API Documentation available at ${address}/docs`);
});