import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ageString'
})
export class AgePipe implements PipeTransform {

  transform(age: string): any {
    if (!age) return null;
    return age.substring(0, age.length - 2);
  }

}
