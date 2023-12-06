import { MigrationInterface, QueryRunner } from "typeorm";

export class DbCreate1701307153050 implements MigrationInterface {
    name = 'DbCreate1701307153050'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`FK_2a49e91fc4a2d2498b1d12445e4\` ON \`comment\``);
        await queryRunner.query(`DROP INDEX \`FK_94a85bb16d24033a2afdd5df060\` ON \`comment\``);
        await queryRunner.query(`CREATE TABLE \`post\` (\`id\` int NOT NULL AUTO_INCREMENT, \`writer\` varchar(255) NOT NULL, \`boardId\` int NOT NULL, \`title\` varchar(100) NOT NULL, \`content\` varchar(1000) NOT NULL, \`hit\` int NOT NULL DEFAULT '0', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`post\` ADD CONSTRAINT \`FK_f14520d0bd6065ff49ab5a8c389\` FOREIGN KEY (\`writer\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`post\` ADD CONSTRAINT \`FK_73a3143e2efbdbab45872c47fd7\` FOREIGN KEY (\`boardId\`) REFERENCES \`board\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_2a49e91fc4a2d2498b1d12445e4\` FOREIGN KEY (\`writer\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_94a85bb16d24033a2afdd5df060\` FOREIGN KEY (\`postId\`) REFERENCES \`post\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_94a85bb16d24033a2afdd5df060\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_2a49e91fc4a2d2498b1d12445e4\``);
        await queryRunner.query(`ALTER TABLE \`post\` DROP FOREIGN KEY \`FK_73a3143e2efbdbab45872c47fd7\``);
        await queryRunner.query(`ALTER TABLE \`post\` DROP FOREIGN KEY \`FK_f14520d0bd6065ff49ab5a8c389\``);
        await queryRunner.query(`DROP TABLE \`post\``);
        await queryRunner.query(`CREATE INDEX \`FK_94a85bb16d24033a2afdd5df060\` ON \`comment\` (\`postId\`)`);
        await queryRunner.query(`CREATE INDEX \`FK_2a49e91fc4a2d2498b1d12445e4\` ON \`comment\` (\`writer\`)`);
    }

}
