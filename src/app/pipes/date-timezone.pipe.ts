import { Pipe, PipeTransform } from '@angular/core';
import * as momentTimezone from 'moment-timezone';

@Pipe({
  name: 'dateTimezone'
})
export class DateTimezonePipe implements PipeTransform {

  transform(date: Date): Date {
    const moment = momentTimezone;
    return moment.tz(date, 'America/Sao_Paulo').toDate();
  }

}
