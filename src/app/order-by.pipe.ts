import { Pipe, PipeTransform } from '@angular/core';
import { ConsoleService } from '@ng-select/ng-select/lib/console.service';

@Pipe({
  name: 'orderBy',
  pure: true
})
export class OrderByPipe implements PipeTransform {

  transform(value: any[], orderOrientation: string, property: boolean, propertyName: string = ""): any[] {
    var ascend = false;
    if (orderOrientation == "Ascendente") {
      ascend = true;
    }
    if (property) {
      if (propertyName != "") {
        var order = value.sort((a: any, b: any) => ((new Date(b[propertyName])) < (new Date(a[propertyName]))) ? 1 : -1);
      } else {
        return value;
      }
    } else {
      var order = value.sort((a: any, b: any) => (new Date(a) < new Date(b)) ? 1 : -1);
    }
    if (!ascend && property)
        return order.reverse();

    return order;
  }

}