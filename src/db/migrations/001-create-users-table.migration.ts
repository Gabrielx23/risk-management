import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('users')
    .addColumn('id', 'uuid', (col) => col.notNull().unique().primaryKey())
    .addColumn('name', 'varchar(50)', (col) => col.notNull())
    .addColumn('role', 'varchar(150)', (col) => col.notNull())
    .addColumn('email', 'varchar(150)', (col) => col.unique().notNull())
    .addColumn('password', 'varchar(255)', (col) => col.notNull())
    .addColumn('createdAt', 'timestamp', (col) => col.notNull())
    .addColumn('updatedAt', 'timestamp', (col) => col.notNull())
    .ifNotExists()
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('users').execute();
}
