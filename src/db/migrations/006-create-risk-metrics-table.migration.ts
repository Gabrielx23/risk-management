import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('riskMetrics')
    .addColumn('id', 'uuid', (col) => col.notNull().unique().primaryKey())
    .addColumn('likelihood', 'integer', (col) => col.notNull())
    .addColumn('impact', 'integer', (col) => col.notNull())
    .addColumn('comment', 'varchar(255)', (col) => col.notNull())
    .addColumn('problemId', 'uuid', (col) => col.notNull())
    .addColumn('createdAt', 'timestamp', (col) => col.notNull())
    .addColumn('createdBy', 'uuid', (col) => col.notNull())
    .addForeignKeyConstraint(
      'risk_metric_user_id_fk',
      ['createdBy'],
      'users',
      ['id'],
      (cb) => cb.onDelete('cascade')
    )
    .addForeignKeyConstraint(
      'risk_metric_problem_id_fk',
      ['problemId'],
      'problems',
      ['id'],
      (cb) => cb.onDelete('cascade')
    )
    .ifNotExists()
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('riskMetrics').execute();
}
