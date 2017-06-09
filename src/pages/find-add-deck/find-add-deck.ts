import { Component, ViewChild } from '@angular/core';
import { NavController, Nav, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { OAuthService } from '../oauth/oauth.service';
import { LanguageService } from '../../services/language.service';
import { DeckService } from '../../services/deck.service';
import { CameraService } from '../../services/camera.service';

import { MyDecksPage } from '../my-decks/my-decks';
import { HomePage } from '../home/home';
import { FindAddCardListPage } from '../find-add-card-list/find-add-card-list';

@Component({
  selector: 'page-find-add-deck',
  templateUrl: 'find-add-deck.html',
})
export class FindAddDeckPage {
  @ViewChild(Nav) nav: Nav;

  public profile: any;
  public items: any;
  public chosenDecks: Array<any>;
  public displayDecks: Array<any> = [];

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    public translateService: TranslateService,
    private oauthService: OAuthService,
    public languageService: LanguageService,
    public cameraService: CameraService,
    public deckService: DeckService) {
    oauthService.getProfile().toPromise()
      .then(profile => {
        this.profile = profile;
        translateService.use(languageService.translateLang(this.profile.nativeLang));
        this.deckService.getAllDecks()
      })
      .catch(err => {
        console.log("Error" + JSON.stringify(err))
      });
    this.cameraService.showLoading(1100);
    setTimeout(() => {
      this.initializeItems();
    }, 1000)

  }

  initializeItems() {
    this.chosenDecks = [];
    this.items = this.deckService.allDecks.map((deck) => {
        deck['status'] = '';
        if (!deck.cards[0]) {
          deck.cards[0] = { imgUrl: "https://www.wired.com/wp-content/uploads/2015/01/learning-styles.jpg", status: "" }
        }
        return deck;
      })
  }
  
  openCard(deckId) {
    this.deckService.getAllCardsInADeck(deckId);
    this.navCtrl.push(FindAddCardListPage, { native: this.languageService.translateLang(this.profile.nativeLang), learning: this.languageService.translateLang(this.profile.learnLang) })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FindAddDeckPage');
  }

  goHome() {
    this.navCtrl.setRoot(HomePage)
  }

  editDeck() {
    this.navCtrl.setRoot(MyDecksPage)
  }

  getItems(ev) {
    this.initializeItems();
    
    var val = ev.target.value;
    
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        if ((item.name.toLowerCase().indexOf(val.toLowerCase()) > -1)) { console.log(item.name.toLowerCase) }
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  addDeckToUser(deckId, index) {
    let pos = this.chosenDecks.indexOf(deckId);
      this.items[+index]["status"] = "added!";
    if (pos === -1) {
      this.chosenDecks.push(deckId);
      this.displayDecks.push(index);
    } else if (pos !== -1) {
      this.items[+index]["status"] = "";
      this.chosenDecks[pos] = -1;
      this.displayDecks[pos] = -1;
    }
  }

 
  addDecks() {
    this.chosenDecks = this.chosenDecks.filter(el => el !== -1);
    let body = {
      "id": this.profile.id,
      "decks": JSON.stringify(this.chosenDecks)
    }
    this.deckService.addDecksToUser(body);
    this.navCtrl.setRoot(MyDecksPage)
  }
}
