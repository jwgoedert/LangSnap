import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Nav, NavParams } from 'ionic-angular';
import { MyDecksPage } from '../my-decks/my-decks';
import { EditDeckAddPage } from '../edit-deck-add/edit-deck-add';
import { TranslateService } from '@ngx-translate/core';
import { OAuthService } from '../oauth/oauth.service';
import { LanguageService } from '../../services/language.service';
import { DeckService } from '../../services/deck.service';
import { CameraService } from '../../services/camera.service';
import { CardViewerPage } from '../card-viewer/card-viewer';
import { CreateDeckPage } from '../create-deck/create-deck';

@IonicPage()
@Component({
  selector: 'page-find-card',
  templateUrl: 'find-card.html',
})
export class FindCardPage {
  @ViewChild(Nav) nav: Nav;
  public profile: any;
  public items: any;
  public nativeLang: any;
  public learnLang: any;
  public chosenCards: Array<any>;
  public deck: Array<any>;
  public added: string;
  public deckTitle: string;
  public displayCards: Array<any> = [];

  constructor(
    public navParams: NavParams,
    public navCtrl: NavController,
    public translateService: TranslateService,
    public languageService: LanguageService,
    private oauthService: OAuthService,
    public cameraService: CameraService,
    public deckService: DeckService) {
    oauthService.getProfile().toPromise()
      .then(profile => {
        this.profile = profile;
        translateService.use(languageService.translateLang(this.profile.nativeLang));
        this.nativeLang = this.languageService.translateLang(this.profile.nativeLang);
        this.learnLang = this.languageService.translateLang(this.profile.learnLang);
        this.deck = this.deckService.getDeckId();
        this.deckTitle = this.cameraService.getTitle();
        this.items = this.deckService.getAllCards();
      })
      .catch(err => {
        console.log("Error" + JSON.stringify(err))
      });
    this.cameraService.showLoading(3000);
    setTimeout(() => {
      this.items = this.deckService.allCards.map((card) => {
        if ((typeof card.wordMap === 'string')) {
          card.wordMap = JSON.parse(card.wordMap);
        }
        card['status'] = '';
        return card;
      })
      this.initializeItems();
    }, 1500)

  }

  initializeItems() {
    this.chosenCards = [];
    this.items = this.deckService.allCards;
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

  markCard(item, index) {
    let pos = this.chosenCards.indexOf(item);
    if (this.chosenCards.indexOf(item) === -1) {
      this.items[index].status = "checkmark-circle";
      this.chosenCards.push(item);
      this.displayCards.push(index);
    } else if(pos !== -1){
      this.items[index].status = "";
      this.chosenCards[pos] = -1;
      this.displayCards[pos] = -1;
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad FindCardsPage');
  }
  addCardsToCurrentDeck() {
    this.chosenCards = this.chosenCards.filter(el=> el !== -1);
    this.displayCards = this.displayCards.filter(el=> el !== -1);
   
    let addCards =
      {
        "deck_id": this.deck,
        "cardIds": this.chosenCards
      }
    this.displayCards.forEach(card => {
      let cardInfo = {
        "word":  this.items[card].wordMap,
        "image": this.items[card].imgUrl
      }
      console.log('JSON.stringify(cardInfo)')
      console.log(JSON.stringify(cardInfo))
      console.log('JSON.stringify(cardInfo)')
      this.deckService.addToDeckCreation(cardInfo) 
    })
 
    this.deckService.postCardsToUserDeck(addCards);
    this.chosenCards = [];
    setTimeout(() => {
      if(this.navParams.data.findAdd === true){
        this.navCtrl.setRoot(EditDeckAddPage);
      } else {
        this.navCtrl.setRoot(CreateDeckPage);
      }
    }, 1500)
  }
}