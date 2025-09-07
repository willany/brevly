import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "../../db";
import { schema } from "../../db/schemas";
import { desc, eq } from "drizzle-orm";
import { CsvExportService } from "../../../services/csvExport";

export const createLink: FastifyPluginAsyncZod = async (fastify) => {
    fastify.post('/links', {
      schema: {
          summary: 'Create link',
          description: 'Create a new link',
          tags: ['links'],
          requestBody: {
              type: 'object',
              required: ['originalUrl', 'customShortUrl'],
              properties: {
                  originalUrl: {
                      type: 'string',
                      format: 'uri',
                      description: 'The original URL to be shortened',
                  },
                  customShortUrl: {
                      type: 'string',
                      description: 'The custom short URL to be used',
                  },
              },
          },
          response: {
              201: z.object({
                  id: z.string(),
                  originalUrl: z.string(),
                  shortUrl: z.string(),
                  accessCount: z.number(),
                  createdAt: z.string().datetime(),
              }),
              400: z.object({
                  error: z.string(),
              }),
              409: z.object({
                  error: z.string(),
              }),
              500: z.object({
                  error: z.string(),
              }),
          },
      },
    }, async (request, reply) => {
      const { originalUrl, customShortUrl } = request.body as { originalUrl: string, customShortUrl: string };
      const existingLink = await db.select().from(schema.links).where(eq(schema.links.shortUrl, customShortUrl));
      if (existingLink.length > 0) {
        return reply.status(409).send({
          error: 'Short URL already exists',
        });
      }
      const [link] = await db.insert(schema.links).values({
        originalUrl,
        shortUrl: customShortUrl,
        accessCount: 0,
      }).returning();
      return reply.status(201).send({
        ...link,
        createdAt: link.createdAt.toISOString()
      });
    });
};

export const getAllLinks: FastifyPluginAsyncZod = async (fastify) => {
fastify.get('/links', {
    schema: {
        summary: 'List links',
        description: 'List all links',
        tags: ['links'],
        response: {
            200: z.array(
                z.object({ id: z.string(), 
                    originalUrl: z.string(), 
                    shortUrl: z.string(), 
                    accessCount: z.number(), 
                    createdAt: z.string().datetime() 
                })),
        },
    },
}, async (request, reply) => {
    const links = await db.select().from(schema.links).orderBy(desc(schema.links.createdAt));
    const formattedLinks = links.map(link => ({
    ...link,
    createdAt: link.createdAt.toISOString()
    }));
    return reply.status(200).send(formattedLinks);
});
};

export const getLink: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get('/links/:shortUrl', {
    schema: {
        summary: 'Get link',
        description: 'Get a link by its short URL',
        tags: ['links'],
    },
  }, async (request, reply) => {
    const { shortUrl } = request.params as { shortUrl: string };
    const link = await db.select().from(schema.links).where(eq(schema.links.shortUrl, shortUrl)).orderBy(desc(schema.links.createdAt));
    return reply.status(200).send(link);
  });
};

export const getOriginalUrl: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get('/links/:shortUrl/redirect', {
    schema: {
        summary: 'Get original URL',
        description: 'Get the original URL by its short URL',
        tags: ['links'],
    },
  }, async (request, reply) => {
    const { shortUrl } = request.params as { shortUrl: string };
    const link = await db.select().from(schema.links).where(eq(schema.links.shortUrl, shortUrl));
    await db.update(schema.links).set({ accessCount: link[0].accessCount + 1 }).where(eq(schema.links.shortUrl, shortUrl));
    return reply.status(200).send({originalUrl: link[0].originalUrl});
  });
};

export const exportLinks: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get('/links/export', {
    schema: {
      summary: 'Export links',
      description: 'Export links',
      tags: ['links'],
    },
  }, async (request, reply) => {
    const links = await db.select().from(schema.links);
    const csvExportService = new CsvExportService();
    const formattedLinks = links.map(link => ({
    ...link,
    createdAt: link.createdAt
    }));
    const exportResult = await csvExportService.exportToCsv(formattedLinks);
    return reply.status(200).send(exportResult);
  });
};

export const deleteLink: FastifyPluginAsyncZod = async (fastify) => {
  fastify.delete('/links/:id', {
    schema: {
      summary: 'Delete link',
      description: 'Delete a link by its ID',
      tags: ['links'],
    },
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    await db.delete(schema.links).where(eq(schema.links.id, id));
    return reply.status(204).send();
  });
};