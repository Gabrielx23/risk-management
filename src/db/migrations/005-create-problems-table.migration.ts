import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('problems')
    .addColumn('id', 'uuid', (col) => col.notNull().unique().primaryKey())
    .addColumn('title', 'varchar(255)', (col) => col.notNull())
    .addColumn('description', 'varchar(255)')
    .addColumn('result', 'integer')
    .addColumn('createdAt', 'timestamp', (col) => col.notNull())
    .addColumn('solvedAt', 'timestamp')
    .addColumn('updatedAt', 'timestamp', (col) => col.notNull())
    .addColumn('createdBy', 'uuid', (col) => col.notNull())
    .addForeignKeyConstraint(
      'problem_user_id_fk',
      ['createdBy'],
      'users',
      ['id'],
      (cb) => cb.onDelete('cascade')
    )
    .ifNotExists()
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('problems').execute();
}
