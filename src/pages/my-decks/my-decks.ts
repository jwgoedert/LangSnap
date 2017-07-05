import { Component, ViewChild } from '@angular/core';
import { NavController, Nav, AlertController } from 'ionic-angular';
import { EditDeckPage } from '../edit-deck/edit-deck';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import { OAuthService } from '../oauth/oauth.service';
import { DeckService } from '../../services/deck.service';
import { CameraService } from '../../services/camera.service';
import { CardViewerPage } from '../card-viewer/card-viewer'
@Component({
  selector: 'page-my-decks',
  templateUrl: 'my-decks.html',
})
export class MyDecksPage {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = MyDecksPage;
  public profile: any;
  public items: any;
  public deckToSend: any;
  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    public translateService: TranslateService,
    public languageService: LanguageService,
    oauthService: OAuthService,
    public cameraService: CameraService,
    public deckService: DeckService, ) {
    oauthService.getProfile().toPromise()
      .then(profile => {
        this.profile = profile;
        translateService.use(languageService.translateLang(this.profile.nativeLang));
        this.deckService.getUsersDecks(this.profile.id)
      })
      .catch(err => {
        console.log("Error" + JSON.stringify(err))
      });
    this.cameraService.showLoading(1500);
    setTimeout(() => {
      this.items = this.deckService.usersDecks.map((deck) => {
        if (!deck.cards[0]) { deck.cards[0] = { imgUrl: "https://www.wired.com/wp-content/uploads/2015/01/learning-styles.jpg" } }
        return deck;
      });
      this.initializeItems();
    }, 1500)

  }

  initializeItems() {
    if (this.deckService.usersDecks.length === 0) {
      setTimeout(() => {
        this.items = this.deckService.usersDecks; 
      }, 1500)
    } else {
        this.items = this.deckService.usersDecks; 
    }
  }
  getItems(ev) {
    this.initializeItems();
    var val = ev.target.value;
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  openDeck(deckId) {
    this.deckService.getAllCardsInADeck(deckId);
    this.deckService.setDeckId(deckId);
    this.deckService.setEditDeckId(deckId);
    this.navCtrl.push(CardViewerPage);
  }

  editDeck(deckId) {
    this.deckService.setEditDeckId(deckId);
    this.deckService.setDeckId(deckId);
    this.deckService.deckEditCards = this.deckService.getAllCardsInADeck(deckId);
    this.cameraService.showLoading(1500);
    this.navCtrl.setRoot(EditDeckPage);
  }

  card(length, image) {
    if (image === "https://www.wired.com/wp-content/uploads/2015/01/learning-styles.jpg") {
      return "0 Cards"
    } else {
      return length === 1 ? '1 Card' : `${length} Cards`;
    }
  }

  deleteDeck(index, deckName) {
    let confirm = this.alertCtrl.create({
      title: `Sure you want to delete the ${deckName} Deck?`,
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

            this.deckService.deleteADeck(index, this.profile.id);
            this.navCtrl.setRoot(MyDecksPage)
          }
        }
      ]
    });
    confirm.present();
  }
}