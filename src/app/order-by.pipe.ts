import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy',
  pure: true
})
export class OrderByPipe implements PipeTransform {

  transform(value: any[], orden: string, date: boolean, property: boolean, propertyName: string = ""): any[] {
    
    return value;
  }

}