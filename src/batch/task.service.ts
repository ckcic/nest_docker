import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  // * * * * * *
  // | | | | | |
  // | | | | | day of week (요일, 0-7의 값을 가짐. 0과 7은 일요일)
  // | | | | month (월, 0-12의 값을 가짐. 0과 12는 12월)
  // | | | day of month (날, 1-31의 값을 가짐)
  // | | hour (시간, 0-23의 값을 가짐)
  // | minute (분, 0-59의 값을 가짐)
  // second (초, 0-59의 값을 가짐, 선택 사항)

  // * * * * * *        초마다
  // 45 * * * * *       매분, 45초에
  // 0 10 * * * *       매시간, 10분에
  // 0 /30 9-17 * * *   오전 9시부터 오후 5시까지 30분마다
  // 0 30 11 * * 1-5    월요일~금요일 오전 11시 30분에

  constructor(private schedulerRegistry: SchedulerRegistry) { // SchedulerRegistry 객체를 TaskService에 주입
    this.addCronJob();  // TaskService가 생성될 때 크론 잡 하나를 SchedulerRegistry에 추가. 등록이 아님
  }

  addCronJob() {
    const name = 'cronSample';

    const job = new CronJob('* * * * * *', () => {
      this.logger.warn(`run! ${name}`);
    })

    this.schedulerRegistry.addCronJob(name, job);

    this.logger.warn(`job ${name} added!`)
  }
  
 /* 
  // @Cron('* * * * * *', { name: 'cronTask' })
  // 한 번만 수행되는 태스크를 등록하려면 수행되는 시각을 Date 객체로 직접 설정 하면 된다.
  @Cron(new Date(Date.now() + 3 * 1000))  // 앱이 실행되고 나서 3초 뒤에 수행
  handleCron() {
    this.logger.log('Task Called');
  }

  @Interval('intervalTask', 3000) // 첫 번째 인수는 태스크의 이름, 두 번째 인수는 지연 시간(밀리세컨드) - 앱이 실행된 후 3초 후에 처음 수행되고, 3초 마다 반복
  hadleInterval() {
    this.logger.log('Task Called by interval');
  }

  @Timeout('timeoutTask', 5000) // 첫 번째 인수는 태스크의 이름, 두 번째 인수는 지연 시간(밀리세컨드) - 앱이 실행된 후 태스크를 단 한 번만 수행
  handleTimeout() {
    this.logger.log('Task Called by timeout');
  }
   */
}
