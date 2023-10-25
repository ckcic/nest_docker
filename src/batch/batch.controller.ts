import { Controller, Post } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

@Controller('batches')
export class BatchController {
  constructor(private scheduler: SchedulerRegistry) {}  // SchedulerRegistry 객체를 주입

  @Post('/start-sample')
  start() {
    const job = this.scheduler.getCronJob('cronSample');  // SchedulerRegistry에 등록된 크론 잡을 가져오기, 등록할 때는 선언한 이름을 사용

    job.start();  // 크론 잡 실행
    console.log('start!! ', job.lastDate());  // lastDate(): 작업이 마지막으로 실행된 날짜를 반환
  }

  @Post('/stop-sample')
  stop() {
    const job = this.scheduler.getCronJob('cronSample');  // SchedulerRegistry에 등록된 크론 잡을 가져오기, 등록할 때는 선언한 이름을 사용

    job.stop(); // 크론 잡 중지
    console.log('stopped!! ', job.lastDate());
  }
}
