import { Component, ViewChild } from '@angular/core';
import { NavController, Nav } from 'ionic-angular';
import { EditDeckPage } from '../edit-deck/edit-deck';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import { OAuthService } from '../oauth/oauth.service';
import { DeckService } from '../../services/deck.service';

@Component({
  selector: 'page-my-decks',
  templateUrl: 'my-decks.html',
})
export class MyDecksPage {
  @ViewChild(Nav) nav: Nav;

  public rootPage: any = MyDecksPage;
  public profile: any;
  public items: any;

  constructor(public navCtrl: NavController,
    public translateService: TranslateService,
    public languageService: LanguageService,
    oauthService: OAuthService,
    public deckService: DeckService, ) {
    // oauthService.getProfile().toPromise()
    //     .then(profile => {
    //       console.log(profile, 'profile')
    //       this.profile = profile;
    //       translateService.use(languageService.translateLang(this.profile.nativeLang));
    //     })
    //     .catch(err => {
    //       console.log("Error" + JSON.stringify(err))
    //     }); 
    this.initializeItems();
  }
  
  initializeItems() {
    this.items = this.deckService.usersDecks; 
   
  }

  getItems(ev) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the ev target
    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
  ///////////////
  ionViewDidLoad() {
    console.log('ionViewDidLoad MyDecksPage');
  }

  editDeck() {
    console.log('edit deck button was clicked!')
    this.navCtrl.setRoot(EditDeckPage)
  }

  deleteDeck() {
    console.log('delete deck button was clicked!')
  }
}
