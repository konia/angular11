import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ago'
})
export class AgoPipe implements PipeTransform {

  transform(value: string): string | number {
    const sec = Math.round((+(new Date()) - +(new Date(value))) / 1000);
    const daysRound = Math.floor(sec / 60 / 60 / 24);
    const hoursRound = Math.floor(sec / 60 / 60 - (24 * daysRound));
    const minutesRound = Math.floor(sec / 60 - (24 * 60 * daysRound) - (60 * hoursRound));
    const secondsRound = Math.floor(sec - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound));

    const timeMap = {
      days: daysRound,
      hours: hoursRound,
      minutes: minutesRound,
      seconds: secondsRound,
    };
    const time = Object.entries(timeMap).find(item => item[1] > 0) || [];
    return time.length > 0 ? `${time[1]}${time[0]}` : '';
  }

}
