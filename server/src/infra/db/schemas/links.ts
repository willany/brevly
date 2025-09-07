import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';

export const links = pgTable('links', {
  id: text('id').primaryKey().$defaultFn(() => uuidv7()),
  originalUrl: text('original_url').notNull(),
  shortUrl: text('short_url').notNull().unique(),
  accessCount: integer('access_count').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}); 