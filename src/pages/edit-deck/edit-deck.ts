import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Nav, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { OAuthService } from '../oauth/oauth.service';
import { LanguageService } from '../../services/language.service';
import { DeckService } from '../../services/deck.service';
import { CameraService } from '../../services/camera.service';

import { MyDecksPage } from '../my-decks/my-decks';
import { EditDeckAddPage } from '../edit-deck-add/edit-deck-add';

@IonicPage()
@Component({
  selector: 'page-edit-deck',
  templateUrl: 'edit-deck.html',
})
export class EditDeckPage {
  @ViewChild(Nav) nav: Nav;
  public profile: any;
  public items: any;
  public deckName: string;
  public deck: any;
  public added: string;
  public addIcon: string;
  public rootPage: any = EditDeckPage;
  public nativeLang: any;
  public learnLang: any;

  constructor(public navCtrl: NavController,
    public translateService: TranslateService,
    public languageService: LanguageService,
    private oauthService: OAuthService,
    public cameraService: CameraService,
    public deckService: DeckService,
    public alertCtrl: AlertController) {
    oauthService.getProfile().toPromise()
      .then(profile => {
        this.profile = profile;
        translateService.use(languageService.translateLang(this.profile.nativeLang));
        this.nativeLang = this.languageService.translateLang(this.profile.nativeLang);
        this.learnLang = this.languageService.translateLang(this.profile.learnLang);
        this.deckService.getCurrentDeck();
        this.deck = this.deckService.currentDeck[0];
      })
      .catch(err => {
        console.log("Error" + JSON.stringify(err))
      });
    setTimeout(() => {
      console.log('this.deckService.currentDeck')
      console.log(JSON.stringify(this.deckService.currentDeck))
      console.log('this.deckService.currentDeck')
      this.deckName = this.deckService.currentDeck[0].name;
      this.initializeItems();
    }, 1500)
  }

  initializeItems() {
    this.items = this.deckService.currentDeck[0].cards.map(el => {
        if (typeof el.wordMap === 'string') {
          if (JSON.parse(el.wordMap)['sorry']) {
            el.wordMap = {
              "en": "No Cards",
              "es": "No Tarjetas",
              "fr": "Pas de cartes",
              "de": "Keine Karten",
              "ja": "カードなし",
              "ru": "Нет карточек"
            }
          } else {
            el.wordMap = JSON.parse(el.wordMap);
          }
        }
        return el;
      });;
  }
  getItems(ev) {
    this.initializeItems();
    var val = ev.target.value;

    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.wordMap[this.nativeLang].toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
  
  done() {
    this.navCtrl.setRoot(MyDecksPage);
  }

  addCard() {
    console.log('this.deck.id')
    console.log(this.deck.id)
    console.log('this.deck.id')
    this.navCtrl.setRoot(EditDeckAddPage, { deckId: this.deck.id, deckName: this.deckName });
  }
  
  removeCardFromUserDeck(itemId, index) {
    let confirm = this.alertCtrl.create({
      title: `Sure you want to delete this Card?`,
      message: '',
      buttons: [
        {
          text: 'No',
          handler: () => {
          }
        },
        {
          text: 'Yes',
          handler: () => {
            for (let i = 0; i < this.items.length; i++) {
              if (this.items[i].id == itemId) {
                this.items.splice(i, 1);
              }
            }
            this.deckService.deleteCardFromUserDeck(this.profile.id, this.deck.id, itemId, );
            this.deckService.deckEditCards = this.deckService.getAllCardsInADeck(this.deck.id);
          }
        }
      ]
    });
    confirm.present();
  }
}
