import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatFileSize'
})
export class FormatFileSizePipe implements PipeTransform {

  transform(value: any, args?: any): string {
    const s = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'];
    const e = Math.floor(Math.log(value) / Math.log(1024));
    return (value / Math.pow(1024, e)).toFixed(2) + ' ' + s[e];
  }

}
