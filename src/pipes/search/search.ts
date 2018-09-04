import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SearchPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(items: any[], terms: string): any[] {
    if(!items) return [];
    if(!terms) return items;
    console.log(items)
    terms = terms.toLowerCase();
    return items.filter( it => {
      return String(it.orphacode).toLowerCase().includes(terms) || it.name.toLowerCase().includes(terms); // only filter country name
    });
  } 
}
