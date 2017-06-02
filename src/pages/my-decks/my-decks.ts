import { Component, ViewChild } from '@angular/core';
import { NavController, Nav } from 'ionic-angular';
import { EditDeckPage } from '../edit-deck/edit-deck';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import { OAuthService } from '../oauth/oauth.service';
import { DeckService } from '../../services/deck.service';
import { CardViewerPage } from '../card-viewer/card-viewer'
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
    oauthService.getProfile().toPromise()
        .then(profile => {
          console.log(profile, 'profile')
          this.profile = profile;
          translateService.use(languageService.translateLang(this.profile.nativeLang));
          this.deckService.getUsersDecks(this.profile.id)
      })
        .catch(err => {
          console.log("Error" + JSON.stringify(err))
        }); 
    // this.initializeItems();
    setTimeout(() => {
      this.items = this.deckService.usersDecks.map((deck) => {
        if(!deck.cards[0]) { deck.cards[0] = {imgUrl: "https://www.wired.com/wp-content/uploads/2015/01/learning-styles.jpg"}}
        return deck;
      })
    }, 1500)

  }
  
  // initializeItems() {
    
  //   // this.items = this.deckService.usersDecks; 
  // }
  // getItems(ev) {
  //   // Reset items back to all of the items
  //   this.initializeItems();
  //   // set val to the value of the ev target
  //   var val = ev.target.value;
  //   // if the value is an empty string don't filter the items
  //   if (val && val.trim() != '') {
  //     this.items = this.items.filter((item) => {
  //       return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
  //     })
  //   }
  // }

  ///////////////
  ionViewDidLoad() {
    console.log('ionViewDidLoad MyDecksPage');
  }
  openCard(deckId) {
    console.log(deckId)
    console.log("deckId")
    this.deckService.getAllCardsInADeck(deckId);
    this.navCtrl.setRoot(CardViewerPage)
  }
  editDeck() {
    console.log('edit deck button was clicked!')
    this.navCtrl.setRoot(EditDeckPage)
  }

  deleteDeck() {
    console.log('delete deck button was clicked!')
  }
}