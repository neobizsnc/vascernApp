import { Component } from '@angular/core';
import { AboutPage } from '../about/about';
import { MenuPage } from '../menu/menu';
import { SearchPage } from '../search/search';
import { FavouritePage } from '../favourite/favourite';



@Component({
  selector: 'tabs',
  templateUrl: 'tabs.html'
})



export class TabsPage {

  tab1Root = MenuPage;
  tab2Root = FavouritePage;
  tab3Root = SearchPage;
  tab4Root = AboutPage;


  constructor() {

  }


}
