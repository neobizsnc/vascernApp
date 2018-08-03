import { Component } from '@angular/core';
import { MenuPage } from '../menu/menu';
import { SearchPage } from '../search/search';
import { FavouritePage } from '../favourite/favourite';
import { MembersPage } from '../members/members';



@Component({
  selector: 'tabs',
  templateUrl: 'tabs.html'
})



export class TabsPage {

  tab1Root = MenuPage;
  tab2Root = FavouritePage;
  tab3Root = SearchPage;
  tab4Root = MembersPage;


  constructor() {

  }



}
