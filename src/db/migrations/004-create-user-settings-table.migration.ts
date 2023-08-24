import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('userSettings')
    .addColumn('userId', 'uuid', (col) => col.notNull())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('value', 'text', (col) => col.notNull())
    .addPrimaryKeyConstraint('user_settings_primary_key', ['name', 'userId'])
    .addForeignKeyConstraint(
      'user_setting_user_id_fk',
      ['userId'],
      'users',
      ['id'],
      (cb) => cb.onDelete('cascade')
    )
    .ifNotExists()
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('userSettings').execute();
}
