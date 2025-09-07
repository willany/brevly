import { FastifyInstance } from 'fastify';
import { fastify } from 'fastify';
import { fastifyCors } from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { getAllLinks, createLink, getLink, getOriginalUrl, exportLinks, deleteLink } from '../infra/http/routes/link';

export async function createTestServer(): Promise<FastifyInstance> {
  const server = fastify({
    logger: false,
  });

  server.setValidatorCompiler(validatorCompiler);
  server.setSerializerCompiler(serializerCompiler);

  server.setErrorHandler((error, request, reply) => {
    if (error.validation) {
      return reply.status(400).send({
        message: 'Validation error',
        error: error.validation,
      });
    }
    return reply.status(500).send({
      message: 'Internal server error',
    });
  });

  await server.register(fastifyCors, {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  await server.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Brevly API',
        description: 'A comprehensive API for creating and managing shortened URLs with analytics and export capabilities.',
        version: '1.0.0',
      },
    },
    transform: jsonSchemaTransform,
  });

  await server.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
  });

  await server.register(getAllLinks);
  await server.register(createLink);
  await server.register(getLink);
  await server.register(getOriginalUrl);
  await server.register(exportLinks);
  await server.register(deleteLink);

  server.get('/health', async (request, reply) => {
    return { status: 'ok' };
  });

  await server.ready();
  return server;
}

export const mockLink = {
  id: 'test-link-id',
  originalUrl: 'https://example.com',
  shortUrl: 'test123',
  accessCount: 0,
  createdAt: new Date('2024-01-01T00:00:00Z'),
};

export const mockLinks = [
  {
    id: 'test-link-1',
    originalUrl: 'https://example.com',
    shortUrl: 'test123',
    accessCount: 5,
    createdAt: new Date('2024-01-01T00:00:00Z'),
  },
  {
    id: 'test-link-2',
    originalUrl: 'https://example.com',
    shortUrl: 'test456',
    accessCount: 10,
    createdAt: new Date('2024-01-02T00:00:00Z'),
  },
];