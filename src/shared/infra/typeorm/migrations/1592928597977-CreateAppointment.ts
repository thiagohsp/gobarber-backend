import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateAppointment1592928597977
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'appointments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'provider_id', type: 'uuid', isNullable: true },
          { name: 'date', type: 'timestamp with time zone', isNullable: false },
          { name: 'created_at', type: 'date', default: 'now()' },
          { name: 'updated_at', type: 'date', default: 'now()' },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('appointments');
  }
}
