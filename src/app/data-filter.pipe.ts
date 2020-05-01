import { Pipe, PipeTransform } from '@angular/core';
import { debounce } from 'lodash';


@Pipe({
  name: 'dataFilter'
})
export class DataFilterPipe implements PipeTransform {

  constructor() {
    this.search = debounce(this.search, 1000);
  }
  transform(value: string, filter: string): any {
    if (!filter) return value;
    this.search(value, filter);
  }

  search(value: string, filter: string): any {
    if (!filter) filter = '';
    let regex = new RegExp('^.*' + filter + '.*\n?', 'mg')
    return value.match(regex);
  }
}
