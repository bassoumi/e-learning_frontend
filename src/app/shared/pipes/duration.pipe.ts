import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'durationPipe'
})
export class DurationPipe implements PipeTransform {
  transform(minutes: number | null | undefined): string {
    if (minutes == null) return '';  // handles null and undefined
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }
}
