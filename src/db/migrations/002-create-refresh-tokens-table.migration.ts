import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('refreshTokens')
    .addColumn('token', 'varchar(255)', (col) =>
      col.notNull().unique().primaryKey()
    )
    .addColumn('userId', 'uuid', (col) => col.notNull())
    .addColumn('createdAt', 'timestamp', (col) => col.notNull())
    .addColumn('expiresAt', 'timestamp', (col) => col.notNull())
    .addForeignKeyConstraint(
      'refresh_token_user_id_fk',
      ['userId'],
      'users',
      ['id'],
      (cb) => cb.onDelete('cascade')
    )
    .ifNotExists()
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('refreshTokens').execute();
}
