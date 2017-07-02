import { Component } from '@angular/core';
import { NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { CameraService } from '../../services/camera.service';
import { CreateDeckPage } from '../create-deck/create-deck';
import { EditDeckAddPage } from '../edit-deck-add/edit-deck-add';
import { LanguageService } from '../../services/language.service';
import { DeckService } from '../../services/deck.service';
import { OAuthService } from '../oauth/oauth.service';
import { TranslateService } from '@ngx-translate/core';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Screenshot } from '@ionic-native/screenshot';

@Component({
  selector: 'page-card',
  templateUrl: 'card.html',
})
export class CardPage {
  public title: string;
  public cardInfo: any;
  public translation: any;
  public profile: any;
  public rootPage: any = CardPage;

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public cameraService: CameraService,
    private oauthService: OAuthService,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private deckService: DeckService,
    private socialSharing: SocialSharing,
    private screenshot: Screenshot,
    public platform: Platform) {
      oauthService.getProfile().toPromise()
        .then(profile => {
          this.profile = profile;
          translateService.use(languageService.translateLang(this.profile.nativeLang));
          this.cameraService.languages(this.languageService.translateLang(this.profile.nativeLang), this.languageService.translateLang(this.profile.learnLang))
        })
        .catch(err => {
          console.log("Error" + JSON.stringify(err))
        });
    this.cardInfo = this.cameraService.getCardInfo();
    this.getTranslation();
  }
  getTranslation() {
    setTimeout(() => {
      this.translation = this.cameraService.getTranslatedWord();
      this.cardInfo.wordMap = this.cameraService.getCardInfo().wordMap;
    }, 1500)
  }
  facebookShare() {
    this.platform.ready().then(() => {
      this.screenshot.URI(80)
        .then((res) => {
            console.log(res);
            this.socialSharing.shareViaFacebook(null, res.URI, null)
              .then(() => {},
                () => {
                  alert('SocialSharing failed');
                });
          },
          () => {
            alert('Screenshot failed');
          });
    });
  }
  
  tryAgain(word) {
    if (word) {
      this.cardInfo.word = word;
      this.cameraService.getTranslation(this.cardInfo.word);
      word = "";
      this.getTranslation();
      this.deckService.editDeckCreation(this.cardInfo.word);
    } else {
      let confirm = this.alertCtrl.create({
        title: `Looks like you didn't put in a new word... You should probably do that.`,
        message: '',
        buttons: [
          {
            text: 'Oh...got it. ',
            handler: () => {
            }
          },
        ]
      });
      confirm.present();
    }
  }

  createCard() {
    let addCard = {
      "user_id": this.profile.id,
      "deck_id": this.deckService.getDeckId(),
      "wordMap": JSON.stringify(this.cardInfo.wordMap),
      "imgUrl": this.cardInfo.picture
    }
    this.deckService.postCardToUserDeck(addCard)
    setTimeout(() => {
      if(this.navParams.data.findAdd === true){
      this.navCtrl.setRoot(EditDeckAddPage);
      } else {
      this.navCtrl.setRoot(CreateDeckPage);
      }
    }, 1500)
  }
}
