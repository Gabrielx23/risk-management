import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('otp')
    .addColumn('id', 'uuid', (col) => col.notNull().unique().primaryKey())
    .addColumn('otp', 'varchar(255)', (col) => col.notNull())
    .addColumn('userId', 'uuid', (col) => col.notNull())
    .addColumn('purpose', 'varchar(255)', (col) => col.notNull())
    .addColumn('createdAt', 'timestamp', (col) => col.notNull())
    .addColumn('expiresAt', 'timestamp', (col) => col.notNull())
    .addForeignKeyConstraint(
      'otp_user_id_fk',
      ['userId'],
      'users',
      ['id'],
      (cb) => cb.onDelete('cascade')
    )
    .ifNotExists()
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('otp').execute();
}
