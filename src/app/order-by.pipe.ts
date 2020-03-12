import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy',
  pure: true
})
export class OrderByPipe implements PipeTransform {

  transform(value: any[], orden: string, date: boolean, property: boolean, propertyName: string = ""): any[] {

    /*if (orden == "Ascendente") {
      console.log(value.sort((a, b) => (a + "").localeCompare((b + ""))));
    } else {
      console.log(value.sort((a, b) => (b + "").localeCompare((a + ""))));
    }*/
    
    return value;
    /*if (property) {
      if (propertyName != "") {
        if(date) {
          console.log(1);
          var order = value.sort((a: any, b: any) => ((new Date(b[propertyName])) < (new Date(a[propertyName]))) ? 1 : -1);
        } else {
          console.log(2);
          var order = value.sort((a: any, b: any) => (a[propertyName].toString().localeCompare(b[propertyName].toString())));
        }
      } else {
        console.log(3);
        return value;
      }
    } else {
      if(date) {
        console.log(4);
        var order = value.sort((a: any, b: any) => (new Date(a) < new Date(b)) ? 1 : -1);
      } else {
        console.log(5);
        var order = value.sort((a: any, b: any) => (a.toString().localeCompare(b.toString())));
      }
    }

    return order;*/
  }

}