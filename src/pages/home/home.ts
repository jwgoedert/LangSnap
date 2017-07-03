import { Component, ViewChild } from '@angular/core';
import { NavController, Nav, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Http } from '@angular/http';

import { OAuthService } from '../oauth/oauth.service';
import { ProfileService } from '../../services/profile.service';
import { DeckService } from '../../services/deck.service';
import { LanguageService } from '../../services/language.service';
import { OAuthProvidersListPage } from '../oauth/list/oauth-providers.list.page';

import { CreateDeckPage } from '../create-deck/create-deck';
import { FindAddDeckPage } from '../find-add-deck/find-add-deck';
import { MyDecksPage } from '../my-decks/my-decks';
import { ProfilePage } from '../profile/profile';
import { AboutUsPage } from '../about-us/about-us';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [OAuthService, ProfileService, LanguageService]
})
export class HomePage {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

	private oauthService: OAuthService;
	public profile: any;
  public user: any;


	constructor(oauthService: OAuthService, 
    public navCtrl: NavController, 
    public translateService: TranslateService,
    public http: Http,
    public profileService: ProfileService,
    public alertCtrl: AlertController,
    public languageService: LanguageService,
    public deckService: DeckService) {
      this.alertCtrl = alertCtrl;
      this.oauthService = oauthService;
      // if (localStorage.getItem('oauthToken') === null) {
      //   this.navCtrl.setRoot(OAuthProvidersListPage);
      // } 
      console.log('update 1.9')
      oauthService.getProfile().toPromise()
        .then(profile => {
          console.log(profile, 'profile')
          this.profile = profile;
          this.user = JSON.stringify(profile);
          if(this.profile.id === -1) {
            this.navCtrl.setRoot(ProfilePage)
          }
          translateService.use(languageService.translateLang(this.profile.nativeLang));
        })
        .catch(err => {
          console.log("Error" + JSON.stringify(err))
        }); 
	}
  aboutUsPage(){
    this.navCtrl.setRoot(AboutUsPage);
  }
  createPage(){
    this.navCtrl.setRoot(CreateDeckPage);
  }
  findAddPage(){
    // this.deckService.getAllDecks()
    this.navCtrl.setRoot(FindAddDeckPage);
  }
  myDecksPage(){
    // this.deckService.getUsersDecks(this.profile.id)
    // this.deckService.getUsersDecks(1)
    this.navCtrl.setRoot(MyDecksPage);
  }
  logout(){
    localStorage.removeItem('oauthToken');
    this.navCtrl.setRoot(OAuthProvidersListPage);
  }
}
