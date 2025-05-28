import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(value: string | Date | null | undefined, format: string = 'mediumDate'): string | null {
    if (!value) return null;

    let date: Date;
    if (typeof value === 'string') {
      date = new Date(value);
      if (isNaN(date.getTime())) {
        return null;  // invalid date string
      }
    } else if (value instanceof Date) {
      date = value;
    } else {
      return null;
    }

    // Simple date formatting example using built-in toLocaleDateString
    // You can enhance this with libraries like date-fns or moment if needed
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
