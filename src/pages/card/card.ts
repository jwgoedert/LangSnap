import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CameraService } from '../../services/camera.service';
import { CreateDeckPage } from '../create-deck/create-deck';
import { LanguageService } from '../../services/language.service';
import { DeckService } from '../../services/deck.service';
import { OAuthService } from '../oauth/oauth.service';
import { TranslateService } from '@ngx-translate/core';
import { Http, RequestOptions, Headers, Request, RequestMethod } from '@angular/http';
import { Config } from '../../config';
// import { TranslateService } from '@ngx-translate/core';
// import { LanguageService } from '../../services/language.service';
  


@Component({
  selector: 'page-card',
  templateUrl: 'card.html',
})
export class CardPage {
  public title: string;
  public translation: any;
  public profile: any;
  public show: boolean = false;
  public cardInfo: any;
  public rootPage: any = CardPage;
  
  constructor(public navCtrl: NavController, 
    public http: Http,
    public navParams: NavParams, 
    public cameraService: CameraService,
    private oauthService: OAuthService,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private deckService: DeckService) {
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
      console.log('v 1.3')
      this.getTranslation();
  }
  getTranslation() {
    setTimeout(() => {
      this.translation = this.cameraService.getTranslatedWord();
    }, 1500)
  }

  tryAgain(word) {
    // send word off fro new translation
    console.log("word")
    console.log(word)
    console.log("word")
    this.cardInfo.word = word;
    this.cameraService.getTranslation(this.cardInfo.word);
    word = "";
    this.getTranslation();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CardPage');
  }

  editWord(word){
    this.show = true;

  }

  createCard() {
     let addCard = {
      "user_id": this.profile.id,
      "deck_id": this.deckService.getDeckId(),
      "wordMap": JSON.stringify({
      [this.profile.nativeLang]: this.cardInfo.word,
      [this.profile.learnLang]: this.translation
      }),
      "imgUrl": this.cardInfo.picture
    }
    this.deckService.postCardToUserDeck(addCard)
    setTimeout(() => {

    this.navCtrl.setRoot(CreateDeckPage)
    }, 1500)
  }
}
