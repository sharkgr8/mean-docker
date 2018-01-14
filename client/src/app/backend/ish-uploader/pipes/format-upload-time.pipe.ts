import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatUploadTime'
})
export class FormatUploadTimePipe implements PipeTransform {

  transform(value: any, args?: any): string {
    const years = Math.floor(value / 31536000);
    if (years) {
      return years + ' year' + this.numberEnding(years);
    }
    const days = Math.floor((value %= 31536000) / 86400);
    if (days) {
      return days + ' day' + this.numberEnding(days);
    }
    const hours = Math.floor((value %= 86400) / 3600);
    if (hours) {
      return hours + ' hour' + this.numberEnding(hours);
    }
    const minutes = Math.floor((value %= 3600) / 60);
    if (minutes) {
      return minutes + ' minute' + this.numberEnding(minutes);
    }
    const seconds = value % 60;
    return seconds + ' second' + this.numberEnding(seconds);
  }

  numberEnding (number) {
    return (number > 1) ? 's' : '';
  }
}
