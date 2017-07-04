import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';

import { HomePage } from '../pages/home/home';
import { OAuthProvidersListPage } from '../pages/oauth/list/oauth-providers.list.page';
import { AboutUsPage } from '../pages/about-us/about-us';
import { MyDecksPage } from '../pages/my-decks/my-decks';
import { FindAddDeckPage } from '../pages/find-add-deck/find-add-deck';
import { CreateDeckPage } from '../pages/create-deck/create-deck';
import { ProfilePage } from '../pages/profile/profile';
import { TransImagePage } from '../pages/trans-image/trans-image';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = OAuthProvidersListPage;
  chosenTheme: string;
  pages: Array<{title: string, component: any, icon: string}>;

  constructor(public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    public translate: TranslateService) {
      this.initializeApp();
      this.chosenTheme = 'blue-theme';
      // used for an example of ngFor and navigation
      translate.setDefaultLang('en');
      this.pages = [
        { title: 'Login', component: OAuthProvidersListPage, icon: 'log-in' },
        { title: 'About Us', component: AboutUsPage, icon: 'home' },
        { title: 'Home', component: HomePage, icon: 'home' },
        { title: 'My Decks', component: MyDecksPage, icon: 'albums' },
        { title: 'Find/Add Decks', component: FindAddDeckPage, icon: 'search' },
        { title: 'Create A Deck', component: CreateDeckPage, icon: 'add' },
        { title: 'Image To Text', component: TransImagePage, icon: 'person' },
        { title: 'Profile', component: ProfilePage, icon: 'person' },
      ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // this.statusBar.styleDefault();
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }
}
