import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "sort"
})
export class SortPipe  implements PipeTransform {
  transform(array: any, ascendent: boolean): any[] {
    if (!Array.isArray(array)) {
      return;
    }
    console.log(ascendent);
    array.sort((a: any, b: any) => {
      if (a < b) {
        return -1;
      } else if (a > b) {
        return 1;
      } else {
        return 0;
      }
    });
    if (!ascendent) {
      return array;
    } else {
      return array.reverse();
    }
  }
}