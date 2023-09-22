import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateUserTable1695364820458 implements MigrationInterface {   // migration:create 명령으로 설정한 이름과 파일 생성 시각을 조합한 이름을 가진 클래스

    public async up(queryRunner: QueryRunner): Promise<void> {  // up 함수는 migration:run 명령으로 마이그레이션이 수행될 때 실행되는 코드
    }

    public async down(queryRunner: QueryRunner): Promise<void> {    // down 함수는 migration:revert 명령으로 마이그레이션을 되돌릴 때 실행되는 코드
    }

}
