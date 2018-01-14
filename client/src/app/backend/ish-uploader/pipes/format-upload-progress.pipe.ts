import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatUploadProgress'
})
export class FormatUploadProgressPipe implements PipeTransform {
  transform(value: any, args?: any): number {
    return Math.floor(value * 100);
  }
}
