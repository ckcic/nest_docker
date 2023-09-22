import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1695366593079 implements MigrationInterface {
    name = 'CreateUserTable1695366593079'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`User\` (\`id\` varchar(255) NOT NULL, \`name\` varchar(30) NOT NULL, \`email\` varchar(60) NOT NULL, \`password\` varchar(30) NOT NULL, \`signupVerifyToken\` varchar(60) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        // User 테이블을 생성하는 SQL문을 실행하는 코드
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`User\``);
        // User 테이블을 삭제하는 SQL문을 실행하는 코드
    }

}
