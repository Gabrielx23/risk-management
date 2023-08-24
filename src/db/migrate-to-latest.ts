import { promises as fs } from 'fs';
import {
  Kysely,
  Migrator,
  PostgresDialect,
  FileMigrationProvider,
} from 'kysely';
import * as path from 'path';
import { Pool } from 'pg';

import { config } from '../config';

async function migrateToLatest(): Promise<void> {
  const db = new Kysely({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: config.DATABASE_URL,
      }),
    }),
  });

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, 'migrations'),
    }),
  });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.info(`Migration "${it.migrationName}" was executed successfully`);
      return;
    }

    if (it.status === 'Error') {
      console.info(`Failed to execute migration "${it.migrationName}"`);
      return;
    }
  });

  if (error) {
    console.error('Failed to migrate');
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}

migrateToLatest();
